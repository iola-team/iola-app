import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as ViewRN } from 'react-native';
import { View, Text, H1, Button } from 'native-base';

import { withStyle } from '~theme';
import imageSource from './image.png';
import Image from '../Image';

@withStyle('Sparkls.ErrorBoundary', {
  flex: 1,
  marginHorizontal: 30,

  'NativeBase.ViewNB': {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,

    '.topSection': {
      flex: 2,

      'iola.Image': {
        width: 59,
        height: 54,
        marginBottom: 20,
      },

      'NativeBase.H1': {
        textAlign: 'center',
        marginBottom: 40,
      },
    },

    '.bottomSection': {
      flex: 1,

      'NativeBase.Text': {
        textAlign: 'center',
        marginBottom: 25,
      },
    },

    'NativeBase.Button': {
      marginHorizontal: 50,
    },
  },
})
export default class ErrorBoundary extends Component {
  static propTypes = {
    onError: PropTypes.func,
    onRequestRelaunch: PropTypes.func.isRequired,
    onReportPress: PropTypes.func.isRequired,
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

  onReportPress = () => {
    const { onReportPress } = this.props;
    const { error } = this.state;

    onReportPress(error);
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
        <View topSection>
          <Image source={imageSource} />
          <H1>Oops! Something went wrong</H1>
          <Button block onPress={this.onRequestRelaunch}>
            <Text>Relaunch Application</Text>
          </Button>
        </View>
        <View bottomSection>
          <Text>
            Or if you currently have free time and if you are a warm-hearted person 
            you can leave a ticket in our Bug tracker
          </Text>

          <Button block secondary onPress={this.onReportPress}>
            <Text>Leave a ticket</Text>
          </Button>
        </View>
      </ViewRN>
    );
  }
}