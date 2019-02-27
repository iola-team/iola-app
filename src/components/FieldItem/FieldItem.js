import React from 'react';
import { View as ViewRN, StyleSheet } from 'react-native';

import { withStyle } from '~theme';

const iconTheme = {
  '.disabled': {
    opacity: 0.5,
  },

  fontSize: 22,
};

export default withStyle('Sparkle.FieldItem', {
  'NativeBase.Label': {
    flex: 1,
    color: '#585A61',
    fontWeight: '600',
    paddingRight: 5,
    flexWrap: 'wrap',
  },

  'NativeBase.Body': {
    'NativeBase.Input': {
      padding: 0,
    },

    'NativeBase.Text': {
      fontSize: 14,
      paddingVertical: 5,
    },

    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  'NativeBase.Right': {
    'NativeBase.Spinner': {
      height: 20,
    },

    'Sparkle.TouchableOpacity': {
      'NativeBase.Icon': {
        ...iconTheme,

        margin: 0,
      },

      alignSelf: 'stretch',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flex: 1,
    },

    'NativeBase.Icon': {
      ...iconTheme,
    },

    flexGrow: 0,
    flexBasis: 30,
  },

  '.last': {
    borderBottomWidth: 0,
  },

  minHeight: 50,
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: '#C9C9C9',
})(ViewRN);
