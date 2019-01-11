import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigation, NavigationActions } from 'react-navigation';
import {
  Text,
  Button,
} from 'native-base';

import * as routes from '../routeNames';

@graphql(gql`
  mutation {
    clearAuthToken @client
  }
`)
@withApollo
@withNavigation
export default class LogoutButton extends Component {
  async onPress() {
    const { mutate, navigation: { navigate }, client } = this.props;

    navigate(routes.AUTHENTICATION);

    await mutate();
    await client.resetStore();
  }

  render() {
    return (
      <Button transparent {...this.props} onPress={::this.onPress}>
        <Text style={{ color: '#BDC0CB' }}>Logout</Text>
      </Button>
    );
  }
}
