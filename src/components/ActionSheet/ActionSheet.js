import React, { Component, forwardRef } from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import ActionSheetRN from 'react-native-actionsheet';

import { withStyleSheet } from '~theme';

/**
 * TODO: Get rid of this ugly lib... Find better one or write own
 * 
 * Available styles:
 * https://github.com/beefe/react-native-actionsheet/blob/master/lib/styles.js
 */
const StyledActionSheet = withStyleSheet('Sparkle.ActionSheet', {
  overlay: {
    opacity: 0.49,
    backgroundColor: '#45474F',
  },

  body: {
    backgroundColor: 'transparent',
  },
})(forwardRef(({ styleSheet, ...props }, ref) => (
  <ActionSheetRN {...props} styles={styleSheet} ref={ref} />
)));

export default class ActionSheet extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    children: PropTypes.func,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: noop,
    children: noop,
  };

  onPressCallback = null;
  actionSheet = null;

  setActionSheet = (ref) => {
    this.actionSheet = ref;
  };

  show = ({ onPress = noop } = {}) => {
    this.actionSheet._root.show();
    this.onPressCallback = onPress;
  }

  onPress = (index) => {
    this.props.onPress(index);
    if (this.onPressCallback) {
      this.onPressCallback(index);
    }
  };

  render() {
    const { children, styleSheet, ...props } = this.props;

    return (
      <>
        {children(this.show)}

        <StyledActionSheet
          {...props}

          styles={styleSheet}
          onPress={this.onPress}
          ref={this.setActionSheet}
        />
      </>
    );
  }
}
