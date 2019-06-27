import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import { constant, assign } from 'lodash';
import { StyleSheet, Platform } from 'react-native';

import { withStyleSheet as styleSheet } from '~theme';
import Icon from '../Icon';

@styleSheet('Sparkle.ScreenHeader', {
  header: {
    height: 52,
    elevation: 0,
    borderBottomWidth: 0,
  },

  opaque: {},
  transparent: {},

  icon: {
    paddingLeft: Platform.select({ ios: 10, default: 0 }),
    paddingRight: 5,
    paddingVertical: 5,
    fontSize: 20,
    marginLeft: -2,
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },
})
export default class ScreenHeader extends PureComponent {
  static HEIGHT = 52;
  static propTypes = {
    renderLeft: PropTypes.func,
    renderRight: PropTypes.func,
    title: PropTypes.string,
  };

  static defaultProps = {
    renderLeft: undefined,
    renderRight: undefined,
    title: undefined,
  };

  getSceneOptions(scene) {
    const { descriptor: { options } } = scene;
    const {
      styleSheet: styles,
      title = options.title,
      renderLeft = constant(options.headerLeft),
      renderRight = constant(options.headerRight),
    } = this.props;

    return {
      ...options,

      title,
      headerBackImage: <Icon name="back" style={styles.icon} />,
      headerLeft: renderLeft(scene),
      headerRight: renderRight(scene),
      headerStyle: [
        styles.header,
        options.headerTransparent ? styles.transparent : styles.opaque,
        options.headerStyle
      ],
      headerTitleStyle: [styles.title, options.headerTitleStyle],
    };
  }

  render() {
    const { scene } = this.props;

    /**
     * Merge custom properties to the current scene descriptor
     */
    assign(scene.descriptor.options, this.getSceneOptions(scene));

    return <Header {...this.props} />;
  }
}
