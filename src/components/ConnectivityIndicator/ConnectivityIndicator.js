import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';
import { getStatusBarHeight, getInset } from 'react-native-safe-area-view';
import { StyleSheet, StatusBar, Platform } from 'react-native';

import { withStyleSheet } from '~theme';

@withStyleSheet('iola.ConnectivityIndicator', {
  root: {
    flex: 1,
  },

  offlineIndicator: {
    ...StyleSheet.absoluteFillObject,
    bottom: null,

    backgroundColor: '#F95356',
    alignItems: 'center',
    padding: 5,
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

  offlineContent: {
    marginTop: 25,
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

    const platformStyles = !isOnline && {
      paddingTop: getStatusBarHeight(),
    };

    return (
      <View style={[styles.root, style]} {...props}>
        <StatusBar
          backgroundColor={isOnline ? null : backgroundColor}
          barStyle={isOnline ? 'default' : 'light-content'}
        />

        <View style={[styles.content, !isOnline && styles.offlineContent]}>
          {children}

          {!isOnline && <View style={styles.overlay} />}
        </View>

        {!isOnline && (
          <View style={[styles.offlineIndicator, platformStyles]}>
            <Text style={styles.offlineIndicatorText}>You are offline</Text>
          </View>
        )}
      </View>
    );
  }
}
