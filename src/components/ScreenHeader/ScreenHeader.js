import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import { constant } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import Icon from '../Icon';

@styleSheet('Sparkle.ScreenHeader', {
  header: {
    elevation: 0,
    borderBottomWidth: 0,
  },

  icon: {
    fontSize: 16,
    color: '#BDC0CB',
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },
})
export default class ScreenHeader extends PureComponent {
  static HEIGHT = Header.HEIGHT;

  static propTypes = {
    renderLeft: PropTypes.func,
    renderRight: PropTypes.func,
    title: PropTypes.string,
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
      headerStyle: [styles.header, options.headerStyle],
      headerTitleStyle: [styles.title, options.headerTitleStyle],
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

    return <Header {...headerProps} />;
  }
}
