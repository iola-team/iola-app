import React, { Component, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'native-base';

import { withStyleSheet } from 'theme';
import TouchableOpacity from '../TouchableOpacity';

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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  'Sparkle.TouchableOpacity': {
    '.cancelButton': {
      'NativeBase.Text': {
        color: '#BDC0CB',
      },

      marginRight: 'auto',
    },

    '.doneButton': {
      'NativeBase.Text': {
        color: '#5F96F2',
      },

      marginLeft: 'auto',
    },

    'NativeBase.Text': {
      fontSize: 14,
    },

    padding: 16, // TODO: variables.contentPadding
  },
})
export default class BackdropHeader extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,

    onDone: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    dragging: false,
    onDone: () => null,
    onCancel: () => null,
  };

  render() {
    const { style, title, styleSheet: styles, onCancel, onDone } = this.props;
    const titleElement = isValidElement(title) ? title : <Text style={styles.title}>{title}</Text>;

    return (
      <View style={[styles.root, style]}>
        <View style={styles.dragHandle} />
        <View style={styles.header}>
          <TouchableOpacity cancelButton onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>

          {titleElement}

          <TouchableOpacity doneButton onPress={onDone}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}