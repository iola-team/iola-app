import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ProfileFieldsView } from 'components';

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
    const { navigation } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query query={userFieldsQuery} variables={{ id }}>
        {({ data, loading }) => !loading && (
          <ProfileFieldsView user={data.user} />
        )}
      </Query>
    );
  }
}
