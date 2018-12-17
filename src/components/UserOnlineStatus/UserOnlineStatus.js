import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const Status = connectToStyleSheet('status', View).withProps(({ isOnline }) => ({
  backgroundColor: isOnline ? '#3BC486' : '#BDC0CB',
}));

@styleSheet('Sparkle.UserOnlineStatus', {
  status: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})
export default class UserOnlineStatus extends Component {
  static propTypes = {
    isOnline: PropTypes.bool, // @TODO: make it isRequired after user data will be ready
  };

  static defaultProps = {
    isOnline: false,
  };

  render() {
    return <Status isOnline={this.props.isOnline} />;
  }
}
