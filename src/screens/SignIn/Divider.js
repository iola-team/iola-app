import React, { PureComponent } from 'react';
import { Text, View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';

const Root = connectToStyleSheet('root', View);
const Line = connectToStyleSheet('line', View);
const Label = connectToStyleSheet(() => 'label', Text);

@styleSheet('Sparkle.Divider', {
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  label: {
    paddingHorizontal: 5,
    fontSize: 12,
    lineHeight: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    opacity: 0.5,
  },
})
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
    );
  }
}
