import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { View, Text } from 'native-base';

import { ProfileFieldsView } from 'components';
import Tab from './Tab';

const userFieldsQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...ProfileFieldsView_user
    }
  }

  ${ProfileFieldsView.fragments.user}
`;

export default class UserInfoTab extends Component {
  static navigationOptions = {
    title: 'Info',
  };

  render() {
    const { navigation, ...props } = this.props;
    const id = navigation.state.params.id;

    return (
      <Tab {...props}>
        <Query query={userFieldsQuery} variables={{ id }}>
          {({ data, loading }) => !loading && (
            <ProfileFieldsView user={data.user} />
          )}
        </Query>
      </Tab>
    );
  }
}
