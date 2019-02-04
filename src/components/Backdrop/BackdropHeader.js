import React, { Component, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import { withStyleSheet } from 'theme';

@withStyleSheet('Sparkle.BackdropHeader', {
  root: {

  },

  dragHandle: {
    width: 64,
    height: 4,
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#E1E3E8',
    opacity: 0.6,
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  right: {
    ...StyleSheet.absoluteFillObject,
    left: null,
    justifyContent: 'center',
  },

  left: {
    ...StyleSheet.absoluteFillObject,
    right: null,
    justifyContent: 'center',
  },

  'Sparkle.TouchableOpacity': {
    '.cancel': {
      'NativeBase.Text': {
        color: '#BDC0CB',
      },
    },

    'NativeBase.Text': {
      color: '#5F96F2',
      fontSize: 14,
    },

    padding: 16, // TODO: variables.contentPadding
  },
})
export default class BackdropHeader extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,

    rightElement: PropTypes.element,
    leftElement: PropTypes.element,
  };

  static defaultProps = {
    dragging: false,
    rightElement: null,
    leftElement: null,
  };

  render() {
    const { style, title, styleSheet: styles, rightElement, leftElement } = this.props;

    return (
      <View style={[styles.root, style]}>
        <View style={styles.dragHandle} />
        <View style={styles.header}>
          {leftElement && <View style={styles.left}>{leftElement}</View>}
          {isValidElement(title) ? title : <Text style={styles.title}>{title}</Text>}
          {rightElement && <View style={styles.right}>{rightElement}</View>}
        </View>
      </View>
    );
  }
}