import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import { Platform } from 'react-native';
import { constant } from 'lodash';
import {
  View,
  Text,
  Icon,
} from 'native-base';


import { withStyleSheet as styleSheet } from 'theme';
import { BackButton } from 'components';

@styleSheet('Sparkle.ScreenHeader', {
  header: {
    elevation: 0,
  },

  right: {
    paddingRight: 16,
  },

  left: {

  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  }
})
export default class ScreenHeader extends PureComponent {
  static propTypes = {
    renderLeft: PropTypes.func,
    renderRight: PropTypes.func,

    title: PropTypes.string,
  };
  
  getScreenOptions(screenDetails, { index }) {
    const { styleSheet, renderLeft, renderRight, title } = this.props;

    const hasLeft = index !== 0 || screenDetails.options.headerLeft || renderLeft;
    const leftOffsetStyle = !hasLeft && Platform.OS === 'android' ? { left: 56 } : null;
    const defaultLeft = index === 0 ? constant(null) : ({ onPress }) => (
      <BackButton style={{ alignSelf: 'center' }} onPress={onPress} />
    );

    return {
      ...screenDetails.options,

      title: title || screenDetails.options.title,
      headerLeft: (props) => (
        <View style={styleSheet.left}>
          {
            renderLeft
              ? renderLeft(screenDetails, props)
              : (screenDetails.options.headerLeft || defaultLeft(props))
          }
        </View>
      ),
      headerRight: (
        <View style={styleSheet.right}>
          {
            renderRight
              ? renderRight(screenDetails)
              : (screenDetails.options.headerRight || null)
          }
        </View>
      ),

      headerStyle: [styleSheet.header, screenDetails.options.headerStyle],
      headerTitleStyle: [styleSheet.title, leftOffsetStyle, screenDetails.options.headerTitleStyle],
    };
  }

  render() {
    const headerProps = {
      ...this.props,

      getScreenDetails: (scene) => {
        const originalDetails = this.props.getScreenDetails(scene);

        return {
          ...originalDetails,
          options: {
            ...this.getScreenOptions(originalDetails, scene),
          }
        }
      }
    }

    return (
      <Header {...headerProps} />
    )
  }
}
