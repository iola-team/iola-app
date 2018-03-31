import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import {
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Right
} from 'native-base';

export const ITEM_HEIGHT = 66;

export default class UserListItem extends PureComponent {
  render() {
    const { item: { node } } = this.props;
    const avatarUrl = node.avatar ? node.avatar.url : 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';

    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: avatarUrl }} />
        </Left>
        <Body>
        <Text>{node.name}</Text>
        <Text note>{" "}</Text>
        </Body>
        <Right>
          <Moment note fromNow>
            {node.activityTime}
          </Moment>
        </Right>
      </ListItem>
    );
  }
}
