import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Animated } from 'react-native';

import { withStyleSheet } from '~theme';
import Icon from '../Icon';
import Spinner from '../Spinner';
import TouchableOpacity from '../TouchableOpacity';

@withStyleSheet('Sparkle.SearchBar', {
  root: {
    overflow: 'hidden',
    flex: 1,
  },

  input: {
    flex: 1,
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

  spinner: {
    color: '#AFB2BF',
    marginTop: -1,
    marginLeft: -1.5,
    marginRight: 5.5,
  },

  clearButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearIcon: {
    fontSize: 20,
    color: '#AFB2BF',
  },
})
export default class SearchBar extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    styleSheet: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired,
    searching: PropTypes.bool,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChangeText: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    style: null,
    searching: false,
    autoFocus: false,
    cancelAnimatedValue: new Animated.Value(0),
    onChangeText: () => null,
  };

  onClearPress = () => this.props.onChangeText('');

  render() {
    const {
      styleSheet: styles,
      style,
      placeholder,
      value,
      searching,
      autoFocus,
      onChangeText,
      
      ...props
    } = this.props;

    return (
      <View {...props} style={[style, styles.root]}>
        <View style={styles.inputWrap}>
          {searching ? (
            <Spinner size={20} thickness={1.5} style={styles.spinner} />
          ) : (
            <Icon style={styles.icon} name="search" />
          )}

          <TextInput
            style={styles.input}
            autoFocus={autoFocus}
            placeholder={placeholder}
            placeholderTextColor="#BDC0CB"
            value={value}
            onChangeText={onChangeText}
          />

          {!!value && (
            <TouchableOpacity style={styles.clearButton} onPress={this.onClearPress}>
              <Icon style={styles.clearIcon} name="cancel" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}