import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as ViewRN } from 'react-native';
import { Text, Button } from 'native-base';

import { withStyle } from '~theme';

@withStyle('Sparkls.ErrorBoundary', {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',

  'NativeBase.Text': {
    fontSize: 24,
    marginBottom: 50,
  },

  'NativeBase.Button': {
    alignSelf: 'center',
  }
})
export default class ErrorBoundary extends Component {
  static propTypes = {
    onError: PropTypes.func,
    onRequestRelaunch: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    onError: () => null,
  };

  static getDerivedStateFromProps({ onError }, state) {
    return {
      ...state,
      isErrorHandled: state.error && onError(state.error) === true
    };
  }

  state = {
    isErrorHandled: false,
    error: null,
  }

  onRequestRelaunch = () => {
    const { onRequestRelaunch } = this.props;
    const { error } = this.state;

    onRequestRelaunch(error);
  };

  componentDidCatch(error) {
    this.setState({ error, isErrorHandled: false });
  }

  render() {
    const { children, ...props } = this.props;
    const { isErrorHandled, error } = this.state;

    if (!error || isErrorHandled) {
      return children;
    }

    return (
      <ViewRN {...props}>
        <Text>Oops...</Text>
        <Button onPress={this.onRequestRelaunch}>
          <Text>Relaunch App</Text>
        </Button>
      </ViewRN>
    );
  }
}