import React, { Component } from 'react';
import { isUndefined } from 'lodash';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import FieldView from './FieldView';

@withStyle('Sparkle.SwitchView')
export default class SwitchView extends Component {
  render() {
    const {
      value,
      ...props
    } = this.props;

    return (
      <FieldView
        {...props}
      >
        {!isUndefined(value) && (
          <Text>{value ? 'Yes' : 'No'}</Text>
        )}
      </FieldView>
    );
  }
}
