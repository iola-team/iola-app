import React, { PureComponent } from 'react';
import {
  Button,
  Icon
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.BackButton', {
  icon: {
    fontSize: 35,
    color: '#BDC0CB',
  },

  button: {

  }
})
export default class BackButton extends PureComponent {
  render() {
    const { styleSheet, style, ...props } = this.props;

    return (
      <Button rounded light transparent {...props} style={[style, styleSheet.button]}>
        <Icon style={styleSheet.icon} name={'ios-arrow-back'} />
      </Button>
    );
  }
}
