import React, { Component, Fragment } from 'react';
import { Text } from 'native-base';

import FieldView from './FieldView';
import { withStyle } from 'theme';

@withStyle('Sparkle.TextView')
export default class TextView extends Component {
  render() {
    const {
      value,
      secure,
      ...props
    } = this.props;

    /**
     * TODO: handle secure presentation properly
     */
    return (
      <FieldView
        {...props}
      >
        <Text>
          {secure ? 'Secure' : value}
        </Text>
      </FieldView>
    );
  }
}
