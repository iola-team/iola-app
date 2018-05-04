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
  },
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

    return key || `place-${pos}`;
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
          <Left>
            <Place key={this.getItemKey(0)} style={styleSheet.leftPlace}>
              {this.renderItem(0)}
            </Place>
          </Left>
          <Right>
            {[1, 2, 3, 4].map((pos, index) => (
              <Place key={this.getItemKey(pos)} style={styleSheet.rightPlace}>
                {this.renderItem(pos)}
              </Place>
            ))}
          </Right>
          <Bottom>
            {[5, 6, 7, 8].map((pos, index) => (
              <Place key={this.getItemKey(pos)} style={styleSheet.bottomPlace}>
                {this.renderItem(pos)}
              </Place>
            ))}
          </Bottom>
        </Grid>
      </Root>
    );
  }
}
