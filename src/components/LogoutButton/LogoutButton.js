import React, { Component, createRef } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigation } from 'react-navigation';
import { Text } from 'native-base';

import * as routes from '~screens/routeNames';
import TouchableOpacity from '../TouchableOpacity';
import ActionSheet from '../ActionSheet';

@graphql(gql`
  mutation {
    clearAuthToken @client
  }
`)
@withApollo
@withNavigation
export default class LogoutButton extends Component {
  onLogout = async () => {
    const { mutate, navigation: { navigate }, client } = this.props;

    navigate(routes.LOADING);

    await mutate();
    await client.resetStore();

    navigate(routes.LAUNCH, { loading: true });
  };

  render() {
    return (
      <ActionSheet
        options={['Cancel', 'Logout']}
        cancelButtonIndex={0}
        destructiveButtonIndex={1}
        onPress={index => index && this.onLogout()}
      >
        {show => (
          <TouchableOpacity secondary {...this.props} onPress={() => show()}>
            <Text>Logout</Text>
          </TouchableOpacity>
        )}
      </ActionSheet>
    );
  }
}
