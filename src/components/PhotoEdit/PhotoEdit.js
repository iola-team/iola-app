import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

const photoEdgeFragment = gql`
  fragment PhotoEdit_photoEdge on PhotoEdge {
    cursor
    node {
      id
      url
    }
  }
`;

const Root = connectToStyleSheet('root', View);
const Item = connectToStyleSheet('item', Button).withProps({
  block: true,
  bordered: true,
  secondary: true,
});
const Grid = connectToStyleSheet('grid', View);
const Section = connectToStyleSheet('section', View);
const Left = connectToStyleSheet('left', Section);
const Right = connectToStyleSheet('right', Section);
const Bottom = connectToStyleSheet('bottom', Section);
const Place = connectToStyleSheet('place', View);

@styleSheet('Sparkle.PhotoEdit', {
  root: {

  },

  left: {
    width: '50%',
  },

  leftPlace: {
    width: '100%',
  },

  right: {
    width: '50%',
  },

  rightPlace: {
    width: '50%',
  },

  bottom: {
    width: '100%',
  },

  bottomPlace: {
    width: '25%',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },

  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  place: {
    aspectRatio: 1,
    padding: 4,
  },

  item: {
    flex: 1,
    borderStyle: 'dashed',
  },
})
export default class PhotoEdit extends Component {
  static fragments = {
    photoEdge: photoEdgeFragment,
  }

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(photoEdgeFragment),
    ),
  };

  static defaultProps = {

  };

  renderItem(index) {
    return (
      <Item>
        <Text>{index}</Text>
      </Item>
    );
  }

  renderGrid() {
    const { styleSheet } = this.props;

    return (
      <Grid>
        <Left>
          <Place style={styleSheet.leftPlace}>
            {this.renderItem(0)}
          </Place>
        </Left>
        <Right>
          {[1, 2, 3, 4].map((pos, index) => (
            <Place key={pos} style={styleSheet.rightPlace}>
              {this.renderItem(pos)}
            </Place>
          ))}
        </Right>
        <Bottom>
          {[5, 6, 7, 8].map((pos, index) => (
            <Place key={pos} style={styleSheet.bottomPlace}>
              {this.renderItem(pos)}
            </Place>
          ))}
        </Bottom>
      </Grid>
    );
  }

  render() {
    const { style, edges } = this.props;

    return (
      <Root style={style}>
        {this.renderGrid()}
      </Root>
    );
  }
}
