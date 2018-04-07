import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import { Image, ScrollView } from 'react-native';
import {
  Card,
  CardItem,
  Icon,
  Text,
  Col,
  Row,
  Grid,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

const userFragment = gql`
  fragment UserPhotosCard_user on User {
    id
    photos {
      totalCount
      edges {
        node {
          id
          url
        }
      }
    }
  }
`;

@styleSheet('Sparkle.UserPhotosCard', {
  list: {
    height: 208,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  firstItem: {
    height: 208,
    width: 208,
  },

  item: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  }
})
export default class UserPhotosCard extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  renderEdge({ node }, index) {
    const { styleSheet, onItemPress  } = this.props;

    return (
        <Image
          key={node.id}
          style={[styleSheet.item, index === 0 ? styleSheet.firstItem : null]}
          source={{ uri: node.url }}
        />
    );
  }

  render() {
    const { user: { photos }, styleSheet } = this.props;
    const { edges, totalCount } = photos;


    return (
      <Card transparent topBorder>
        <CardItem header>
          <Text>Photos {totalCount}</Text>
        </CardItem>
        <CardItem>
          <ScrollView horizontal contentContainerStyle={styleSheet.list}>
            {
              edges.map(::this.renderEdge)
            }
          </ScrollView>
        </CardItem>
      </Card>
    );
  }
}
