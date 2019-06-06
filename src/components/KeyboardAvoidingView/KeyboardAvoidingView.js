import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const defaultProps = Platform.select({
  ios: { behavior: 'padding' },
  default: {},      
});

export default ({ style, ...props }) => (
  <KeyboardAvoidingView
    {...defaultProps}
    {...props}

    style={[{ flex: 1 }, style]}
  />
);