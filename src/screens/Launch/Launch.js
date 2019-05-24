import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import * as routes from '../routeNames';
import LoadingBackground from './LoadingBackground';
import SplashBackground from './SplashBackground';

const initQuery = gql`
  query {
    config {
      emailConfirmIsRequired
      userApproveIsRequired
    }
    
    me {
      id
      name
      isEmailVerified
      isApproved
    }
  }
`;

@graphql(initQuery, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
})
@styleSheet('Sparkle.LaunchScreen')
export default class LaunchScreen extends Component {
  componentDidUpdate(nextProps, prevState) {
    const { data, navigation: { navigate } } = this.props;

    if (!data.loading) {
      const { config: { emailConfirmIsRequired, userApproveIsRequired }, me } = data;

      if (!me) {
        navigate(routes.AUTHENTICATION);

        return;
      }

      if (emailConfirmIsRequired && !me.isEmailVerified) {
        navigate(routes.EMAIL_VERIFICATION);

        return;
      }

      if (userApproveIsRequired && !me.isApproved) {
        navigate(routes.PENDING_APPROVAL);

        return;
      }

      navigate(routes.APPLICATION);
    }
  }

  render() {
    const { screenProps: { applicationInitWasTriggeredManually } } = this.props;
    const loading = applicationInitWasTriggeredManually || get(this.props, 'navigation.state.params.loading', false);

    return loading ? <LoadingBackground /> : <SplashBackground />;
  }
}
