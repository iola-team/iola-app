import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

export default ({ style, ...props }) => (
  <KeyboardAvoidingView behavior="padding" {...props} style={[{ flex: 1 }, style]} />
);