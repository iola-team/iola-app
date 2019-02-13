import React, { Component } from 'react';
import { graphql } from 'react-apollo';
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

@graphql(userFieldsQuery, {
  options: ({ navigation }) => ({
    variables: {
      id: navigation.state.params.id,
    },
  }),
})
@withNavigationFocus
export default class UserInfo extends Component {
  static navigationOptions = {
    title: 'Info',
  };

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { data: { user, loading } } = this.props;

    return <ProfileFieldsView loading={loading} user={user} />;
  }
}