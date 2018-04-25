import React, { Component } from 'react';
import {
  View,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.ComponentTemplate', {
  root: {

  }
})
export default class componentTemplate extends Component {
  render() {
    const { style } = this.props;

    return (
      <Root style={style}>
        <Text>Hello ComponentTemplate!</Text>
      </Root>
    );
  }
}
