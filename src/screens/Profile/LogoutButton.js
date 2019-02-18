import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigation } from 'react-navigation';
import { Text } from 'native-base';

import { TouchableOpacity } from 'components';
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
      <TouchableOpacity {...this.props} onPress={::this.onPress}>
        <Text>Logout</Text>
      </TouchableOpacity>
    );
  }
}
