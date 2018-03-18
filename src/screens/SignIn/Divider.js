import React, { PureComponent } from 'react';
import { Text, View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet, withStyle } from 'theme';

const Root = connectToStyleSheet('root', View, {
  flexDirection: 'row',
  alignItems: 'center',
});

const Line = connectToStyleSheet('line', View, {
  flex: 1,
  borderBottomWidth: 1,
  borderBottomColor: '#FFFFFF',
  opacity: 0.5,
});

const Label = connectToStyleSheet('label', Text, {
  paddingHorizontal: 5,
  fontSize: 12,
  textAlign: 'center',
  color: '#FFFFFF',
});

@styleSheet('Sparkle.Divider')
export default class Divider extends PureComponent {
  render() {
    const { children, style } = this.props;

    return (
      <Root style={style}>
        <Line />
        <Label>
          {children}
        </Label>
        <Line />
      </Root>
    )
  }
}
