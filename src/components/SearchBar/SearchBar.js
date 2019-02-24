import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Animated } from 'react-native';

import { withStyleSheet } from 'theme';
import Icon from '../Icon';

@withStyleSheet('Sparkle.SearchBar', {
  root: {
    overflow: 'hidden',
    flex: 1,
  },

  input: {
    
  },

  inputWrap: {
    height: 40,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius:  8,

    backgroundColor: '#F8F9FB',
  },

  icon: {
    color: '#AFB2BF',
    fontSize: 18,
    marginRight: 5,
  },
})
export default class SearchBar extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChangeText: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    autoFocus: false,
    cancelAnimatedValue: new Animated.Value(0),
    onChangeText: () => null,
    onCancelPress: () => null,
  };

  render() {
    const {
      styleSheet: styles,
      style,
      placeholder,
      value,
      autoFocus,
      onChangeText,
      
      ...props
    } = this.props;

    return (
      <View {...props} style={[style, styles.root]}>
        <View style={styles.inputWrap}>
          <Icon style={styles.icon} name="search" />
          <TextInput
            style={styles.input}
            autoFocus={autoFocus}
            placeholder={placeholder}
            placeholderTextColor="#BDC0CB"
            value={value}
            onChangeText={onChangeText}
          />
        </View>
      </View>
    );
  }
}