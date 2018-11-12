import React, { Component, Fragment } from 'react';
import { Text } from 'native-base';

import { withStyle } from 'theme';
import FieldView from './FieldView';

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
          {value && (secure ? 'Secure' : value)}
        </Text>
      </FieldView>
    );
  }
}
