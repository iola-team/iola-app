import React, { Component, createRef } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigation } from 'react-navigation';
import { Text } from 'native-base';

import TouchableOpacity from '../TouchableOpacity';
import ActionSheet from '../ActionSheet';
import * as routes from '../../screens/routeNames';

@graphql(gql`
  mutation {
    clearAuthToken @client
  }
`)
@withApollo
@withNavigation
export default class LogoutButton extends Component {
  actionSheet = createRef();

  logout = async () => {
    const { mutate, navigation: { navigate }, client } = this.props;

    navigate(routes.SIGN_IN);

    await mutate();
    await client.resetStore();
  };

  render() {
    return (
      <ActionSheet
        options={['Cancel', 'Logout']}
        cancelButtonIndex={0}
        destructiveButtonIndex={1}
        onPress={index => index && this.logout()}
      >
        {show => (
          <TouchableOpacity {...this.props} onPress={() => show()}>
            <Text>Logout</Text>
          </TouchableOpacity>
        )}
      </ActionSheet>
    );
  }
}
