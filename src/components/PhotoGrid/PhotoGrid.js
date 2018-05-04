import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';
import Item from './PhotoGridItem';

const Root = connectToStyleSheet('root', View);
const Grid = connectToStyleSheet('grid', View);
const Section = connectToStyleSheet('section', View);
const Left = connectToStyleSheet('left', Section);
const Right = connectToStyleSheet('right', Section);
const Bottom = connectToStyleSheet('bottom', Section);
const Place = connectToStyleSheet('place', View);

@styleSheet('Sparkle.PhotoGrid', {
  root: {

  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    margin: -4,
  },

  place: {
    width: '25%',
    aspectRatio: 1,
  },

  place0: {
    width: '50%',
    position: 'absolute',
  },

  place1: {
    marginLeft: '50%',
  },

  place3: {
    marginLeft: '50%',
  }
})
export default class PhotoGrid extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    getItemKey: PropTypes.func,
  };

  static defaultProps = {
    getItemKey: null,
  };

  getItemKey(pos) {
    const { getItemKey } = this.props;
    const key = getItemKey && getItemKey(pos);

    return key || `place${pos}`;
  }

  renderItem(index) {
    const { renderItem } = this.props;
    const item = renderItem(index);

    return item || (
      <Item placeholder />
    );
  }

  render() {
    const { style, styleSheet, getItemKey } = this.props;

    return (
      <Root style={style}>
        <Grid>
            {
              Array(9).fill(null).map((item, index) => (
                <Place key={this.getItemKey(index)} style={styleSheet[`place${index}`]}>
                  {this.renderItem(index)}
                </Place>
              ))
            }
        </Grid>
      </Root>
    );
  }
}
