import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FastImage from 'react-native-fast-image';
import { get } from 'lodash';

import { withStyleSheet as styleSheet, ConfigurableTheme } from '~theme';
import LaunchError from './LaunchError';
import LaunchSplash from './LaunchSplash';
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
@styleSheet('iola.LaunchScreen')
export default class LaunchScreen extends Component {
  async componentDidUpdate(nextProps, prevState) {
    const { data, navigation: { navigate } } = this.props;

    if (data.error) return;

    if (!data.loading && nextProps.data.networkStatus !== data.networkStatus) {
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

  onChangeWebsiteURL = () => this.props.screenProps.onApplicationReset();

  render() {
    const {
      data: {
        error,
        refetch,
      },
      screenProps: {
        applicationInitWasTriggeredManually,
      },
    } = this.props;
    const loading = applicationInitWasTriggeredManually || get(this.props, 'navigation.state.params.loading', false);

    if (error) return <LaunchError refetch={refetch} onChangeWebsiteURL={this.onChangeWebsiteURL} />;

    return loading ? <Loading /> : <LaunchSplash />;
  }
}
