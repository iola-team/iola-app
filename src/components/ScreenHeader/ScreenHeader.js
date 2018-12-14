import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import { constant } from 'lodash';
import { Icon } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.ScreenHeader', {
  header: {
    elevation: 0,
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  }
})
export default class ScreenHeader extends PureComponent {
  static HEIGHT = Header.HEIGHT;

  static propTypes = {
    renderLeft: PropTypes.func,
    renderRight: PropTypes.func,
    title: PropTypes.string,
  };
  
  getSceneOptions(scene) {
    const { index, descriptor: { options } } = scene;
    const {
      styleSheet,
      title = options.title,
      renderLeft = constant(options.headerLeft),
      renderRight = constant(options.headerRight),
    } = this.props;

    return {
      ...options,

      title,
      headerBackImage: <Icon name="ios-arrow-back" />,
      headerLeft: renderLeft(scene),
      headerRight: renderRight(scene),
      headerStyle: [styleSheet.header, options.headerStyle],
      headerTitleStyle: [styleSheet.title, options.headerTitleStyle],
    };
  }

  render() {
    const { scene } = this.props;

    const headerProps = {
      ...this.props,

      layoutPreset: 'center',
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
