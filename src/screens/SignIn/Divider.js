import React, { PureComponent } from 'react';
import { connectStyle, Text, View } from 'native-base';

import { withStyleSheet as styleSheet } from '../../theme';

@styleSheet('Sparkle.Divider', {
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    opacity: 0.5,
  },
  label: {
    paddingHorizontal: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
})
export default class Divider extends PureComponent {
  render() {
    const { children, style, styleSheet } = this.props;

    return (
      <View style={[styleSheet.root, style]}>
        <View style={styleSheet.line} />
        <Text style={styleSheet.label}>
          {children}
        </Text>
        <View style={styleSheet.line} />
      </View>
    )
  }
}
