import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ImageBackground } from 'react-native';
import { View, Button } from 'native-base';
import { noop } from 'lodash';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import CircularProgress from '../CircularProgress';
import Icon from '../Icon';

const Root = connectToStyleSheet('root', View);
const Layer = connectToStyleSheet('layer', View);
const Progress = connectToStyleSheet('progress', CircularProgress);
const Background = connectToStyleSheet('background', ImageBackground);

@styleSheet('iola.ImageProgress', {
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
  static propTypes = {
    previewUrl: PropTypes.string.isRequired,
    progress: PropTypes.number,
    blurRadius: PropTypes.number,
    onCancel: PropTypes.func,
    active: PropTypes.bool,
    cancelable: PropTypes.bool,
  };

  static defaultProps = {
    onCancel: noop,
    blurRadius: 3,
    progress: 0,
    active: false,
    cancelable: false,
  };

  render() {
    const {
      style,
      children,
      blurRadius,
      progress,
      previewUrl,
      active,
      cancelable,
      onCancel,
    } = this.props;

    return (
      <Root style={style}>
        {children}

        {active && (
          <Layer>
            <Background source={{ uri: previewUrl }} blurRadius={blurRadius}>
              <Progress animated={progress !== null} progress={progress || 0}>
                {cancelable && (
                  <Button block light transparent rounded onPress={onCancel}>
                    <Icon name="close" />
                  </Button>
                )}
              </Progress>
            </Background>
          </Layer>
        )}
      </Root>
    );
  }
}
