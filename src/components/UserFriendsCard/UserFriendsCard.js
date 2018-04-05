import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Icon,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import UserAvatar from '../UserAvatar';

const userFragment = gql`
  fragment UserFriendsCard_user on User {
    friends {
      totalCount
      edges {
        node {
          id
          ...UserAvatar_user
        }
      }
    }
  }

  ${UserAvatar.fragments.user}
`;

@styleSheet('Sparkle.UserFriendsCard', {
  list: {
    flexDirection: 'row',
  },

  item: {
    marginRight: 8,
  }
})
export default class UserFriendsCard extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    onItemPress: () => {}
  }

  renderEdge({ node }) {
    const { styleSheet, onItemPress  } = this.props;

    return (
      <UserAvatar
        key={node.id}
        style={styleSheet.item}
        user={node}
        onPress={() => onItemPress(node.id)}
      />
    );
  }

  render() {
    const { user: { friends }, styleSheet } = this.props;
    const { totalCount, edges } = friends;

    if (!totalCount) {
      return null;
    }

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
