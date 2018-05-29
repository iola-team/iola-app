import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

import {
  Label,
  Body,
  Right,
  Icon,
} from 'native-base';

import { withStyle } from 'theme';

@withStyle('Sparkle.Input', {
  'NativeBase.Label': {
    flex: 1,
    color: '#585A61',
    fontWeight: '600',
    lineHeight: 50,
  },

  'NativeBase.Body': {
    'NativeBase.Input': {
      padding: 0,
    },

    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  'NativeBase.Right': {
    flexGrow: 0,
    flexBasis: 30
  },

  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
export default class Input extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };
  render() {
    const { label, style, children, ...props } = this.props;

    return(
      <View style={style}>
        <Label>
          {label}
        </Label>

        <Body>
          {children}
        </Body>
        <Right />
      </View>
    );
  }
}
