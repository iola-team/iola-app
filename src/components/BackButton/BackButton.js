import React, { PureComponent } from 'react';
import { Button } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import Icon from '../Icon';

@styleSheet('Sparkle.BackButton', {
  button: {
    height: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 17,
  },

  icon: {
    fontSize: 16,
    color: '#BDC0CB',
  },
})
export default class BackButton extends PureComponent {
  render() {
    const { styleSheet: styles, ...props } = this.props;

    return (
      <Button rounded light transparent {...props} style={styles.button}>
        <Icon name="back" style={styles.icon} />
      </Button>
    );
  }
}
