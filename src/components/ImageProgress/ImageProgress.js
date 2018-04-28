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

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.ImageProgress', {
  root: {

  }
})
export default class ImageProgress extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    const { style, children } = this.props;

    return (
      <Root style={style}>
        {children}
      </Root>
    );
  }
}
