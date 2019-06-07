import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Text } from 'native-base';
import { StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';

import { withStyleSheet } from '~theme';

@withStyleSheet('Sparkle.ConnectivityIndicator', {
  root: {
    flex: 1,
  },

  offlineIndicator: {
    backgroundColor: '#F95356',
    alignItems: 'center',
    padding: 5,
    marginTop: -50,
    paddingTop: 50,
  },

  offlineIndicatorText: {
    color: '#FFFFFF',
  },

  offlineStatusBar: {
    backgroundColor: '#F95356',
  },

  content: {
    flex: 1,
  },

  /**
   * TODO: Remove overlay and aloow users browse cahce while offline
   */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(189, 192, 203, 0.5)',
  },
})
export default class ConnectivityIndicator extends Component {
  static propTypes = {
    isOnline: PropTypes.bool.isRequired,
    children: PropTypes.element,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { isOnline, children, styleSheet: styles, style, ...props } = this.props;
    const { backgroundColor } = StyleSheet.flatten(styles.offlineStatusBar);

    const statusBarHeight = getStatusBarHeight(true);
    const platformStyles = Platform.select({
      ios: {
        marginTop: -statusBarHeight,
        paddingTop: statusBarHeight,
      },
      default: {},
    });

    return (
      <View style={[styles.root, style]} {...props}>
        {!isOnline && (
          <>
            <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
            <View style={[styles.offlineIndicator, platformStyles]}>
              <Text style={styles.offlineIndicatorText}>You are offline</Text>
            </View>
          </>
        )}

        <View style={styles.content}>
          {children}

          {!isOnline && <View style={styles.overlay} />}
        </View>
      </View>
    );
  }
}
