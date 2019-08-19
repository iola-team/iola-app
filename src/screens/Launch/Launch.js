import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FastImage from 'react-native-fast-image';
import { get } from 'lodash';

import { withStyleSheet as styleSheet, ConfigurableTheme } from '~theme';
import { withStyleSheet as styleSheet } from '~theme';
import Splash from './Splash';
import Loading from '../Loading';
import * as routes from '../routeNames';

const initQuery = gql`
  query {
    config {
      emailConfirmIsRequired
      userApproveIsRequired
      backgroundUrl
      logoUrl

      ...ConfigurableTheme_variables
    }

    me {
      id
      name
      isEmailVerified
      isApproved
    }
  }

  ${ConfigurableTheme.fragments.variables}
`;

@graphql(initQuery, {
  options: {
    fetchPolicy: 'network-only',
  },
})
@styleSheet('Sparkle.LaunchScreen')
export default class LaunchScreen extends Component {
  async componentDidUpdate(nextProps, prevState) {
    const { data, navigation: { navigate } } = this.props;

    if (!data.loading) {
      const {
        me,
        config: {
          emailConfirmIsRequired,
          userApproveIsRequired,
          backgroundUrl,
          logoUrl,
          primaryColor, // caching
        },
      } = data;
      const images = [backgroundUrl, logoUrl].filter(Boolean).map(uri => ({ uri }));

      await FastImage.preload(images);

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

    return loading ? <Loading /> : <Splash />;
  }
}
