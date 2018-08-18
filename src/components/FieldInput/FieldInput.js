import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

import {
  Label,
  Body,
  Right,
  Icon,
  Spinner,
  Toast,
  Button,
} from 'native-base';

import { withStyle } from 'theme';
import TouchableOpacity from '../TouchableOpacity';
import FieldItem from '../FieldItem';

@withStyle('Sparkle.FieldItemInput', {
  'Sparkle.FieldItem': {
    'NativeBase.Right': {
      'Sparkle.TouchableOpacity': {
        'NativeBase.Icon': {
          color: '#FF0000',
        },
      },

      'NativeBase.Icon': {
        color: '#FF0000',
      },
    },
  },
})
export default class FieldInput extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    last: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
    last: false,
  };

  state = {
    isToastVisible: false,
  }

  showErrorToast = () => {
    const { error } = this.props;

    this.setState({ isToastVisible: true });

    Toast.show({
      text: error,
      duration: 5000,
      buttonText: 'Ok',
      type: 'danger',
      onClose: () => {
        this.setState({ isToastVisible: false });
      },
    })
  };

  renderRight() {
    const { isLoading, error } = this.props;
    const { isToastVisible } = this.state;

    if (isLoading) {
      return (
        <Spinner size={20} />
      );
    }

    if (error) {
      return (
        <TouchableOpacity
          disabled={isToastVisible}
          onPress={this.showErrorToast}
        >
          <Icon name="ios-alert-outline" />
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    const {
      label,
      last,
      children,
    } = this.props;

    return(
      <FieldItem last={last}>
        <Label>{label}</Label>
        <Body>{children}</Body>
        <Right>{this.renderRight()}</Right>
      </FieldItem>
    );
  }
}
