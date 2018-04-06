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
})
export default class BackButton extends PureComponent {
  render() {
    const { styleSheet, ...props } = this.props;

    return (
      <Button rounded light transparent {...props}>
        <Icon style={styleSheet.icon} name={'ios-arrow-back'} />
      </Button>
    );
  }
}
