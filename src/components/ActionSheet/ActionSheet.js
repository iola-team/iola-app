import React, { Component } from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import ActionSheetRN from 'react-native-actionsheet';

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
    this.actionSheet.show();
    this.onPressCallback = onPress;
  }

  onPress = (index) => {
    this.props.onPress(index);
    if (this.onPressCallback) {
      this.onPressCallback(index);
    }
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <>
        {children(this.show)}

        <ActionSheetRN
          {...props}
          onPress={this.onPress}
          ref={this.setActionSheet}
        />
      </>
    );
  }
}
