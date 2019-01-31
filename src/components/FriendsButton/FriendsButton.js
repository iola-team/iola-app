import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Text, Button } from 'native-base';

import { withStyle } from 'theme';
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

@withStyle('Sparkle.FriendsButton', {
  'NativeBase.Button': {
    'NativeBase.Icon': {
      fontSize: 12,
    },
  },
})
export default class FriendsButton extends Component {
  static createOptimisticEdge = createOptimisticEdge;
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edge: fragmentProp(edgeFragment),
    loading: PropTypes.bool,
    onAcceptPress: PropTypes.func.isRequired,
    onCancelPress: PropTypes.func.isRequired,
    onDeletePress: PropTypes.func.isRequired,
    onAddPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    edge: null,
    loading: false,
  };

  actionSheet = createRef();

  getFriendshipType() {
    const { edge } = this.props;

    if (!edge) {
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
    const { style, block, loading} = this.props;
    const friendshipType = this.getFriendshipType();
    const hasIcon = ['active', 'sent'].includes(friendshipType);

    return (
      <Fragment>
        <Button 
          secondary
          bordered
          block={block}
          iconRight={hasIcon}
          style={style}
          disabled={loading}
          onPress={this.onPress}
        >
          <Text style={{ opacity: loading ? 0 : 1 }}>
            Friends
          </Text>
          {hasIcon && <Icon name='check' />}
        </Button>
        {this.renderActionSheet(friendshipType)}
      </Fragment>
    );
  }
}
