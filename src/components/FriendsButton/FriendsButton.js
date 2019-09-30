import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Text, Button } from 'native-base';

import { withStyle } from '~theme';
import Icon from '../Icon';
import ActionSheet from '../ActionSheet';

const edgeFragment = gql`
  fragment FriendsButton_edge on UserFriendEdge {
    user: node {
      id
    }

    friendship {
      id
      status
      user {
        id
      }
    }
  }
`;

const createOptimisticEdge = ({ userId, friendId, status = 'PENDING', friendshipId = -1 }) => ({
  __typename: 'UserFriendEdge',
  user: {
    __typename: 'User',
    id: friendId,
  },

  friendship: {
    __typename: 'Friendship',
    id: friendshipId,
    status,
    user: {
      __typename: 'User',
      id: userId,
    },
  },
});

@withStyle('iola.FriendsButton', {
  'NativeBase.Button': {
    '.hasIcon': {
      'NativeBase.Text': {
        paddingRight: 8,
      },
    },

    'NativeBase.Icon': {
      fontSize: 10,
    },
  },
})
export default class FriendsButton extends PureComponent {
  static createOptimisticEdge = createOptimisticEdge;
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edge: fragmentProp(edgeFragment),
    disabled: PropTypes.bool, 
    loading: PropTypes.bool,
    onAcceptPress: PropTypes.func.isRequired,
    onCancelPress: PropTypes.func.isRequired,
    onDeletePress: PropTypes.func.isRequired,
    onAddPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    edge: undefined,
    disabled: false,
    loading: false,
  };

  actionSheet = createRef();

  getFriendshipType() {
    const { edge } = this.props;

    if (edge === undefined) {
      return null;
    }

    if (edge === null) {
      return 'new';
    }

    const { friendship, user } = edge;

    if (friendship.status === 'ACTIVE') {
      return 'active';
    }

    if (friendship.status === 'IGNORED') {
      return 'ignored';
    }

    return user.id === friendship.user.id ? 'received' : 'sent';
  }

  showActionSheet = () => {
    this.actionSheet.current.show();
  };

  onPress = () => {
    const { onAddPress, onAcceptPress } = this.props;
    const friendshipType = this.getFriendshipType();
    const handlers = {
      new: onAddPress,
      ignored: onAddPress,
      received: onAcceptPress,
      active: this.showActionSheet,
      sent: this.showActionSheet,
    };

    handlers[friendshipType]();
  };

  renderActionSheet(friendshipType) {
    if (['new', 'ignored', 'received'].includes(friendshipType)) {
      return null;
    }

    const { onDeletePress, onCancelPress } = this.props;
    const optionsMap = {
      active: {
        options: [
          'Cancel',
          'Delete friend',
        ],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        onPress: (buttonIndex) => buttonIndex && onDeletePress(),
      },

      sent: {
        options: [
          'Cancel',
          'Cancel request',
        ],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        onPress: (buttonIndex) => buttonIndex && onCancelPress(),
      },
    };

    return (
      <ActionSheet ref={this.actionSheet} {...optionsMap[friendshipType]} />
    );
  }

  render() {
    const { style, block, disabled, loading} = this.props;
    const friendshipType = this.getFriendshipType();
    const hasIcon = ['active', 'sent'].includes(friendshipType);
    const showLoading = loading && friendshipType === null;

    return (
      <Fragment>
        <Button
          hasIcon={hasIcon}
          secondary
          bordered
          block={block}
          iconRight={hasIcon}
          style={style}
          disabled={disabled || showLoading}
          onPress={this.onPress}
        >
          <Text style={{ opacity: showLoading ? 0 : 1 }}>
            Friends
          </Text>
          {hasIcon && <Icon name="check" />}
        </Button>
        {friendshipType && this.renderActionSheet(friendshipType)}
      </Fragment>
    );
  }
}
