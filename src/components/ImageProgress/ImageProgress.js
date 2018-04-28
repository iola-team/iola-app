import React, { Component } from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  View,
  Button,
  Icon,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';
import CircularProgress from '../CircularProgress';

const Root = connectToStyleSheet('root', View);
const Layer = connectToStyleSheet('layer', Animatable.View);
const Progress = connectToStyleSheet('progress', CircularProgress);
const Background = connectToStyleSheet('background', ImageBackground);

@styleSheet('Sparkle.ImageProgress', {
  root: {

  },

  layer: {
    ...StyleSheet.absoluteFillObject,
  },

  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progress: {
    size: 70,
  },
})
export default class ImageProgress extends Component {
  state = {
    isVisible: null,
  };

  static propTypes = {
    previewUrl: PropTypes.string.isRequired,
    progress: PropTypes.number,
    onCancel: PropTypes.func,
    active: PropTypes.bool,
  };

  static defaultProps = {
    onCancel: noop,
    progress: 0,
    active: false,
  };

  static getDerivedStateFromProps({ active }, { isVisible }) {
    return {
      isVisible: isVisible === null ? active : isVisible,
    };
  }

  onAnimationEnd() {
    this.setState({
      isVisible: this.props.active,
    });
  }

  render() {
    const {
      style,
      children,
      progress,
      previewUrl,
      active,
      onCancel,
    } = this.props;

    const { isVisible } = this.state;

    return (
      <Root style={style}>
        {children}

        {
          isVisible && (
            <Layer
              useNativeDriver
              easing="ease-out"
              transition="opacity"
              duration={200}
              onAnimationEnd={::this.onAnimationEnd}
              style={{ opacity: active ? 1 : 0 }}
            >
              <Background source={{ uri: previewUrl }} blurRadius={5}>
                <Progress progress={progress}>
                  <Button block light transparent rounded onPress={onCancel}>
                    <Icon name={'md-close'} />
                  </Button>
                </Progress>
              </Background>
            </Layer>
          )
        }

      </Root>
    );
  }
}
