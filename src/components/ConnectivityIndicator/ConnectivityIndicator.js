import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';
import { StyleSheet, StatusBar } from 'react-native';

import { withStyleSheet } from '~theme';

@withStyleSheet('Sparkle.ConnectivityIndicator', {
  root: {
    flex: 1,
  },

  offlineIndicator: {
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

    return (
      <View style={[styles.root, style]} {...props}>
        {!isOnline && (
          <>
            <StatusBar backgroundColor={backgroundColor} />
            <View style={styles.offlineIndicator}>
              <Text style={styles.offlineIndicatorText}>You are offline</Text>
            </View>
          </>
        )}

        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }
}
