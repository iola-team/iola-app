import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import { Platform } from 'react-native';
import { constant } from 'lodash';
import {
  View,
  Icon,
} from 'native-base';


import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.ScreenHeader', {
  header: {
    elevation: 0,
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
    textAlign: 'center',
    flex: 1,
  }
})
export default class ScreenHeader extends PureComponent {
  static propTypes = {
    renderLeft: PropTypes.func,
    renderRight: PropTypes.func,
    title: PropTypes.string,
  };
  
  getSceneOptions(scene) {
    const { index, descriptor: { options } } = scene;
    const leftPlaceholder = index > 0 ? undefined : <View />;
    const {
      styleSheet,
      renderLeft: headerLeft = options.headerLeft || leftPlaceholder,
      renderRight = constant(options.headerRight || <View />),
      title = options.title,
    } = this.props;

    return {
      ...options,

      title,
      headerBackImage: <Icon name="ios-arrow-back" />,
      headerLeft,
      headerRight: renderRight(scene),
      headerStyle: [styleSheet.header, options.headerStyle],
      headerTitleStyle: [styleSheet.title, options.headerTitleStyle],
    };
  }

  render() {
    const { scene } = this.props;

    const headerProps = {
      ...this.props,

      scene: {
        ...scene,
        descriptor: {
          ...scene.descriptor,
          options: {
            ...scene.options,
            ...this.getSceneOptions(scene),
          },
        },
      },
    };

    return (
      <Header {...headerProps} />
    );
  }
}
