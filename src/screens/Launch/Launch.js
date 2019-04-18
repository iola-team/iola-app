import React, { Component } from 'react';

import { withStyleSheet as styleSheet } from '~theme';
import * as routes from '../routeNames';
import SplashBackground from './SplashBackground';

@styleSheet('Sparkle.LaunchScreen')
export default class LaunchScreen extends Component {
  componentDidUpdate(nextProps, prevState) {
    const { data: { loading, me }, navigation: { navigate } } = this.props;
alert('me: ' + (me ? me.id : null));
    if (!loading && loading !== nextProps.data.loading) {
      navigate(routes.AUTHENTICATION);
    }
  }

  render() {
    return <SplashBackground />;
  }
}
