import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabBar as BottomTabBarRN } from 'react-navigation-tabs';

import { withStyleSheet as styleSheet } from '~theme';
import BarBackgroundView from '../BarBackgroundView';

@styleSheet('Sparkle.BottomTabBar', {
  bar: {
    elevation: 0,
    borderTopWidth: 0,
  },

  transparentBar: {
    backgroundColor: 'transparent',
  },

  opaqueBar: {
    backgroundColor: '#FFFFFF',
  },

  opaqueContainer: {},
  transparentContainer: {
    ...StyleSheet.absoluteFillObject,
    top: null,
  },

  backgroundView: {
    ...StyleSheet.absoluteFillObject,
  },

  label: {},
  tab: {},

  activeTintColor: '#5F96F2',
  inactiveTintColor: '#45474F',
  activeBackgroundColor: 'transparent',
  inactiveBackgroundColor: 'transparent',
})
export default class BottomTabBar extends Component {
  /**
   * Bottom bar height is retreived from:
   * https://github.com/react-navigation/react-navigation-tabs/blob/d2aa789109ed0df61c0c0ac7b759ac386a720804/src/views/BottomTabBar.js#L229
   *
   * TODO: try to not use magic number
   */
  static HEIGHT = 49;

  render() {
    const { styleSheet: styles, barTransparent, ...props } = this.props;
    const barStyle = [
      styles.bar,
      barTransparent ? styles.transparentBar : styles.opaqueBar,
      props.style
    ];

    return (
      <View style={barTransparent ? styles.transparentContainer : styles.opaqueContainer}>
        <BarBackgroundView style={styles.backgroundView} />
        <BottomTabBarRN
          showIcon
          showLabel={false}

          activeTintColor={styles.activeTintColor}
          inactiveTintColor={styles.inactiveTintColor}
          activeBackgroundColor={styles.activeBackgroundColor}
          inactiveBackgroundColor={styles.inactiveBackgroundColor}

          {...props}

          style={barStyle}
          labelStyle={[styles.label, props.labelStyle]}
          tabStyle={[styles.tab, props.tabStyle]}
        />
      </View>
    );
  }
}
