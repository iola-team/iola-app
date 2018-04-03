import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Icon,
  Text,
  Thumbnail,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

const fragments = {
  user: gql`
    fragment FriendsCard_user on User {
      friends {
        totalCount
        edges {
          node {
            id
            avatar {
              id
              url
            }
          }
        }
      }
    }
  `
};

@styleSheet('Sparkle.UserFriendCard', {
  list: {
    flexDirection: 'row',
  },

  item: {
    marginRight: 8,
  }
})
export default class FriendsCard extends PureComponent {
  static fragments = fragments;
  static propTypes = {
    user: fragmentProp(fragments.data),
  };

  renderEdge({ node }) {
    const { styleSheet } = this.props;

    const uri = node.avatar
      ? node.avatar.url
      : 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';

    return (
      <Thumbnail style={styleSheet.item} key={node.id} source={{ uri }} />
    );
  }

  render() {
    const { user: { friends }, styleSheet } = this.props;
    const { totalCount, edges } = friends;

    return (
      <Card transparent topBorder>
        <CardItem header>
          <Text>Friends {totalCount}</Text>
        </CardItem>
        <CardItem style={styleSheet.list}>
          {
            edges.map(::this.renderEdge)
          }
        </CardItem>
      </Card>
    );
  }
}
