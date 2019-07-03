import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, Left, Body, Text, Right, View } from 'native-base';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

import { withStyle } from '~theme';
import UserAvatar from '../UserAvatar';
import Placeholder from '../Placeholder';
import UserHeading from '../UserHeading';

/*
 * TODO: Measure performance of the query with `UserHeading_user` fragment and without it.
 */
const userFragment = gql`
  fragment UserListItem_user on User {
    id
    name
    ...UserAvatar_user
    ...UserHeading_user # Preload user screen data
  }

  ${UserAvatar.fragments.user}
  ${UserHeading.fragments.user}
`;

@withStyle('Sparkle.UserListItem', {
  'NativeBase.ListItem': {
    'NativeBase.Body': {
      flexDirection: 'row',
      alignItems: 'center',
      height: 68,
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
          backgroundColor: '#FFFFFF',
        },
      },

      'NativeBase.Body': {
        'NativeBase.ViewNB': {
          height: 20,
          borderRadius: 4,
          marginRight: 20,
          backgroundColor: '#FFFFFF',
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
    last: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    last: false,
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

  onPress = () => requestAnimationFrame(() => {
    const { onPress, user } = this.props;

    return onPress(user);
  });

  shouldComponentUpdate(nextProps) {
    const { user, last } = this.props;

    return user !== nextProps.user || last !== nextProps.last;
  }

  render() {
    const { user, style, children, ...props } = this.props;

    if (!user) {
      return this.renderPlaceholder();
    }

    return (
      <ListItem {...props} button avatar style={style} onPress={this.onPress}>
        <Left>
          <UserAvatar user={user} />
        </Left>
        <Body>
          <Text name>{user.name}</Text>
        </Body>
        {children && <Right>{children}</Right>}
      </ListItem>
    );
  }
}
