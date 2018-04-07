import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import {
  ListItem,
  Left,
  Body,
  Text,
  Right
} from 'native-base';

import { withStyle } from 'theme';
import UserAvatar from '../UserAvatar';

const userFragment = gql`
  fragment UserListItem_user on User {
    id
    name
    activityTime

    ...UserAvatar_user
  }

  ${UserAvatar.fragments.user}
`;

@withStyle('Sparkle.UserListItem')
export default class UserListItem extends PureComponent {
  static ITEM_HEIGHT = 70;

  static propTypes = {
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => {},
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, onPress, style } = this.props;

    return (
      <ListItem
        style={style}
        button
        avatar
        onPress={() => onPress(user)}
      >
        <Left>
          <UserAvatar user={user} />
        </Left>
        <Body>
          <Text>{user.name}</Text>
        </Body>
        <Right>
          <Moment note fromNow>
            {user.activityTime}
          </Moment>
        </Right>
      </ListItem>
    );
  }
}
