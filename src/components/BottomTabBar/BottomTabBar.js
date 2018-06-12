import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabBar as BottomTabBarRN } from 'react-navigation-tabs';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.BottomTabBar', {
  root: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  label: {

  },

  tab: {

  },

  activeTintColor: '#5F96F2',
  inactiveTintColor: '#45474F',
  activeBackgroundColor: 'transparent',
  inactiveBackgroundColor: 'transparent',
})
export default class BottomTabBar extends Component {
  render() {
    const { styleSheet: styles, ...props } = this.props;

    return (
      <BottomTabBarRN
        showIcon={true}
        showLabel={false}

        activeTintColor={styles.activeTintColor}
        inactiveTintColor={styles.inactiveTintColor}
        activeBackgroundColor={styles.activeBackgroundColor}
        inactiveBackgroundColor={styles.inactiveBackgroundColor}

        {...props}

        style={[styles.root, props.style]}
        labelStyle={[styles.label, props.labelStyle]}
        tabStyle={[styles.tab, props.tabStyle]}
      />
    );
  }
}
