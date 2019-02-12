import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, Left, Body, Text, Right, View } from 'native-base';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

import { withStyle } from 'theme';
import UserAvatar from '../UserAvatar';
import UserOnlineStatus from '../UserOnlineStatus';
import Placeholder from '../Placeholder';

const userFragment = gql`
  fragment UserListItem_user on User {
    id
    name
    ...UserOnlineStatus_user
    ...UserAvatar_user
  }

  ${UserOnlineStatus.fragments.user}
  ${UserAvatar.fragments.user}
`;

@withStyle('Sparkle.UserListItem', {
  'NativeBase.ListItem': {
    'NativeBase.Body': {
      flexDirection: 'row',
      alignItems: 'center',
      height: 68,

      'Sparkle.UserOnlineStatus': {
        marginLeft: -3,
        marginBottom: -2,
      },
    },

    'NativeBase.Right': {
      justifyContent: 'center',
    },
  },

  'Sparkle.Placeholder': {
    'NativeBase.ListItem': {
      'NativeBase.Left': {
        'NativeBase.ViewNB': {
          height: 40,
          width: 40,
          borderRadius: 6,
          backgroundColor: '#F8F9FB',
        },
      },

      'NativeBase.Body': {
        'NativeBase.ViewNB': {
          height: 20,
          borderRadius: 4,
          marginRight: 20,
          backgroundColor: '#F8F9FB',
        },

        height: 68,
        justifyContent: 'center',
      },
    },
  },
})
export default class UserListItem extends Component {
  static ITEM_HEIGHT = 70;

  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    onPress: () => {},
  };

  renderPlaceholder() {
    const { style } = this.props;

    return (
      <Placeholder style={style}>
        <ListItem avatar noBorder>
          <Left>
            <View />
          </Left>
          <Body>
            <View />
          </Body>
        </ListItem>
      </Placeholder>
    );
  }

  render() {
    const { user, onPress, style, children } = this.props;

    if (!user) {
      return this.renderPlaceholder();
    }

    return (
      <ListItem style={style} onPress={() => onPress(user)} button avatar>
        <Left>
          <UserAvatar user={user} />
        </Left>
        <Body>
          <Text>{user.name}</Text>
          <UserOnlineStatus user={user} />
        </Body>
        {children && <Right>{children}</Right>}
      </ListItem>
    );
  }
}
