import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class NoComments extends PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
  };

  style = {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      height: this.props.height,
      backgroundColor: '#F8F9FB',
    },

    noResultsText: {
      fontFamily: 'SF Pro Text',
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      color: '#BDC0CB',
    },

    icon: {
      paddingTop: 25,
      fontSize: 220,
      color: '#F1F2F7',
    },
  };

  render() {
    return (
      <View style={this.style.container} onStartShouldSetResponder={() => true} padderHorizontal>
        <Text style={this.style.noResultsText}>No comments yet</Text>
        <Text style={this.style.noResultsText}>Be the first to comment</Text>
        <Icon style={this.style.icon} name="message" />
      </View>
    );
  }
}
