import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import { BackgroundWithAnimatedLogo } from '~components';
import WebsiteURLForm from './WebsiteURLForm';

export default class WebsiteURLScreen extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  onSubmit = async ({ url }) => {
    try {
      await AsyncStorage.setItem('platformURL', url);
      this.props.onSubmit(url, true);
    } catch (error) {
      // TODO: display Error message?
    }
  };

  render() {
    return (
      <BackgroundWithAnimatedLogo>
        <WebsiteURLForm onSubmit={this.onSubmit} />
      </BackgroundWithAnimatedLogo>
    );
  }
}
