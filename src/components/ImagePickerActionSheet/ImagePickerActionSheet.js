import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import ActionSheet from '../ActionSheet';

const source = {
  gallery: 'gallery',
  camera: 'camera',
};

export default class ImagePickerActionSheet extends Component {
  static source = source;
  static propTypes = {
    onSourceSelect: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    onCancel: noop,
    onSourceSelect: noop,
  };

  getProps() {
    const {
      children,
      options: customOptions = [],
      destructiveButtonIndex: destructive,
      ...props
    } = this.props;

    const options = [
      'Cancel',
      'Add from Camera',
      'Add from Gallery',
    ];

    const actions = [
      ({ onCancel = noop }) => onCancel(),
      ({ onSourceSelect = noop }) => onSourceSelect(source.camera),
      ({ onSourceSelect = noop }) => onSourceSelect(source.gallery),
    ];

    const onAction = (handlers = {}) => (index) => {
      const action = actions[index];
      const press = handlers.onPress || noop;

      return action ? action(handlers) : press(index - 3);
    };

    return {
      ...props,
      cancelButtonIndex: 0,
      destructiveButtonIndex: destructive && destructive + 3,
      options: [ ...options, ...customOptions ],
      onPress: onAction(props),
      children: show => children(handlers => show({
        onPress: onAction(handlers),
      })),
    };
  }

  render() {
    const props = this.getProps();

    return (
      <ActionSheet {...props} />
    );
  }
}
