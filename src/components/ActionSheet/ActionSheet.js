import React, { Component, Fragment } from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import ActionSheetRN from 'react-native-actionsheet';

export default class ActionSheet extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
    cancelButtonIndex: PropTypes.number,
    destructiveButtonIndex: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: noop,
  };

  onPressCallback = null;
  actionSheet = null;

  setActionSheet = (ref) => {
    this.actionSheet = ref;
  };

  show({ onPress = noop } = {}) {
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
      <Fragment>
        {children(::this.show)}

        <ActionSheetRN
          {...props}
          onPress={this.onPress}
          ref={this.setActionSheet}
        />
      </Fragment>
    );
  }
}
