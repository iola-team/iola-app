import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import Item from './PhotoGridItem';

const Root = connectToStyleSheet('root', View);
const Grid = connectToStyleSheet('grid', View);
const Place = connectToStyleSheet('place', View);
const List = connectToStyleSheet('list', View);

@styleSheet('Sparkle.PhotoGrid', {
  root: {
    margin: -4,
    flex: 1,
  },

  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    aspectRatio: 2,
  },

  place: {
    width: '25%',
    aspectRatio: 1,
  },

  list: {
    flexDirection: 'row',
  },

  place0: {
    width: '50%',
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
          {[0, 1, 2, 3, 4].map((index) => (
            <Place key={this.getItemKey(index)} style={styleSheet[`place${index}`]}>
              {this.renderItem(index)}
            </Place>
          ))}
        </Grid>
        <List>
          {[5, 6, 7, 8].map((index) => (
            <Place key={this.getItemKey(index)} style={styleSheet[`place${index}`]}>
              {this.renderItem(index)}
            </Place>
          ))}
        </List>
      </Root>
    );
  }
}
