import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { withStyleSheet as styleSheet } from '~theme';
import ActionSheet from '../ActionSheet';
import TouchableOpacity from '../TouchableOpacity';
import Report from '../Report';
import Icon from '../Icon';

const blockUserMutation = gql`
  mutation UserActionsBlockUser($userId: ID!, $blockUserId: ID!) {
    blockUser(input: {
      userId: $userId
      blockUserId: $blockUserId
    }) {
      blockedUser {
        id
        isBlocked(by: $userId)
      }
    }
  }
`;

const unBlockUserMutation = gql`
  mutation UserActionsUnBlockUser($userId: ID!, $blockedUserId: ID!) {
    unBlockUser(input: {
      userId: $userId
      blockedUserId: $blockedUserId
    }) {
      unBlockedUser {
        id
        isBlocked(by: $userId)
      }
    }
  }
`;

const blockStateQuery = gql`
  query UserActionsBlockStatus($userId: ID!, $byUserId: ID!) {
    user: node(id: $userId) {
      ... on User {
        id
        isBlocked(by: $byUserId)
      }
    }
  }
`;

@styleSheet('iola.ImageView', {
  meatballButton: {
    marginRight: 3,
    padding: 15,
  },

  meatballIcon: {
    fontSize: 18,
  },
})
@graphql(gql`query { me { id } }`, { options: { fetchPolicy: 'cache-first' } })
@graphql(blockStateQuery, {
  name: 'blockData',
  skip: ({ data: { me } }) => !me?.id,
  options: ({ data: { me }, userId }) => ({
    variables: {
      userId,
      byUserId: me?.id
    },
  })
})
@graphql(blockUserMutation, { name: 'blockUser' })
@graphql(unBlockUserMutation, { name: 'unBlockUser' })
export default class UserActions extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  actionSheet = createRef();

  renderActionSheet({ showReport }) {
    const { blockData } = this.props;
    const isBlocked = blockData?.user?.isBlocked;
    const destructiveButtonIndex = isBlocked ? undefined : 2;

    const options = [
      'Cancel',
      'Report User',
      isBlocked ? 'Unblock User' : 'Block User',
    ];

    const actions = [
      noop,
      showReport,
      isBlocked ? this.unBlockUser: this.blockUser,
    ];

    return (
      <ActionSheet
        ref={this.actionSheet}
        cancelButtonIndex={0}
        destructiveButtonIndex={destructiveButtonIndex}
        options={options}
        onPress={index => actions?.[index]()}
      />
    );
  }

  blockUser = async () => {
    const { blockData: { user }, blockUser, data: { me } } = this.props;

    await blockUser({
      variables: { userId: me.id, blockUserId: user.id },
      optimisticResponse: {
        blockUser: {
          __typename: 'BlockUserPayload',
          blockedUser: {
            ...user,
            isBlocked: true,
          },
        },
      },
    });
  };

  unBlockUser = async () => {
    const { blockData: { user }, unBlockUser, data: { me } } = this.props;

    await unBlockUser({
      variables: { userId: me.id, blockedUserId: user.id },
      optimisticResponse: {
        unBlockUser: {
          __typename: 'UnBlockUserPayload',
          unBlockedUser: {
            ...user,
            isBlocked: false,
          },
        },
      },
    });
  };

  showSheet = () => this.actionSheet.current.show();

  render() {
    const { userId, data: { me }, styleSheet: styles } = this.props;

    return userId === me.id ? null : (
      <>
        <TouchableOpacity onPress={this.showSheet} style={styles.meatballButton}>
          <Icon name="more" style={styles.meatballIcon} />
        </TouchableOpacity>

        <Report contentId={userId} title="Report User">
          {showReport => this.renderActionSheet({ showReport })}
        </Report>
      </>
    );
  }
}
