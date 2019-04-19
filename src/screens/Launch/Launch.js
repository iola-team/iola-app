import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import * as routes from '../routeNames';
import SplashBackground from './SplashBackground';

const configQuery = gql`
  query {
    config {
      emailConfirmIsRequired
      userApproveIsRequired
    }
  }
`;

const meQuery = gql`
  query {
    me {
      id
      name
      isEmailVerified
      isApproved
    }
  }
`;

@graphql(configQuery, {
  name: 'configData',
  options: {
    fetchPolicy: 'network-first',
  },
})
@graphql(meQuery, {
  name: 'meData',
  options: {
    fetchPolicy: 'no-cache',
  },
})
@styleSheet('Sparkle.LaunchScreen')
export default class LaunchScreen extends Component {
  componentDidUpdate(nextProps, prevState) {
    const { configData, meData, navigation: { navigate } } = this.props;

    if (!configData.loading && !meData.loading) {
      const { emailConfirmIsRequired, userApproveIsRequired } = configData;
      const { me } = meData;

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
    return <SplashBackground />;
  }
}
