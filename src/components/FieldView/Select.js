import React, { PureComponent } from 'react';
import { find } from 'lodash';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import FieldView from './FieldView';

@withStyle('Sparkle.SelectView')
export default class SelectView extends PureComponent {
  render() {
    const {
      value: rawValue,
      label,
      options,
      ...props
    } = this.props;

    const value = rawValue || [];
    const selectedLabels = value.map(v => find(options, { value: v }).label);

    return (
      <FieldView
        label={label}
        {...props}
      >
        <Text note={!value.length}>
          {!!value.length && selectedLabels.join(', ')}
        </Text>
      </FieldView>
    );
  }
}
