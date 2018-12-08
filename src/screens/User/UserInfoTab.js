import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { ProfileFieldsView } from 'components';

const userFieldsQuery = gql`
  query UserInfoQuery($id: ID!) {
    user: node(id: $id) {
      id
      ...ProfileFieldsView_user
    }
  }

  ${ProfileFieldsView.fragments.user}
`;

@withNavigationFocus
export default class UserInfoTab extends Component {
  static navigationOptions = {
    title: 'Info',
  };

  render() {
    const { navigation: { state }, isFocused } = this.props;

    return (
      <Query skip={!isFocused} query={userFieldsQuery} variables={{ id: state.params.id }}>
        {({ data = {}, loading }) => (
          <ProfileFieldsView loading={loading || !isFocused} user={data.user} />
        )}
      </Query>
    );
  }
}
