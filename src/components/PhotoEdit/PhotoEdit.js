import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OnLayout from 'react-native-on-layout';
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

const Root = connectToStyleSheet('root', OnLayout);

const Item = connectToStyleSheet('item', View);
const Grid = connectToStyleSheet('grid', View);
const Section = connectToStyleSheet('section', View);
const Left = connectToStyleSheet('left', Section);
const Right = connectToStyleSheet('right', Section);
const Bottom = connectToStyleSheet('bottom', Section);

@styleSheet('Sparkle.PhotoEdit', {
  ITEMS_MARGIN: 8,

  root: {

  },

  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },

  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },

  item: {
    backgroundColor: '#00FFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
      <Text>{index}</Text>
    );
  }

  renderGrid(width) {
    const { styleSheet } = this.props;
    const itemSize = (width / 4) - styleSheet.ITEMS_MARGIN * 3 / 4;
    const itemStyle = {
      width: itemSize,
      height: itemSize,
    };

    const halfStyle = {
      width: width / 2 - styleSheet.ITEMS_MARGIN / 2,
      height: width / 2 - styleSheet.ITEMS_MARGIN / 2,
    };

    const gridHeight = halfStyle.height + styleSheet.ITEMS_MARGIN + itemSize;

    return (
      <Grid style={{ height: gridHeight }}>
        <Section style={halfStyle}>
          <Item style={halfStyle}>
            {this.renderItem(0)}
          </Item>
        </Section>
        <Section style={halfStyle}>
          {[1, 2, 3, 4].map((index) => (
            <Item key={index} style={itemStyle}>
              {this.renderItem(index)}
            </Item>
          ))}
        </Section>
        <Section style={{ width }}>
          {[5, 6, 7, 8].map((index) => (
            <Item key={index} style={itemStyle}>
              {this.renderItem(index)}
            </Item>
          ))}
        </Section>
      </Grid>
    );
  }

  render() {
    const { style, edges } = this.props;

    return (
      <Root style={style}>
        {({ width }) => width ? this.renderGrid(width) : null}
      </Root>
    );
  }
}
