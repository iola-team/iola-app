import React, { PureComponent } from 'react';
import { Button } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Icon from '../Icon';
import ScreenHeader from '../ScreenHeader';

@styleSheet('Sparkle.BackButton', {
  button: {
    height: ScreenHeader.HEIGHT,
    width: ScreenHeader.HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 20,
    marginLeft: -2,
  },
})
export default class BackButton extends PureComponent {
  render() {
    const { styleSheet: styles, style, ...props } = this.props;

    return (
      <Button rounded light transparent {...props} style={[style, styles.button]}>
        <Icon name="back" style={styles.icon} />
      </Button>
    );
  }
}
