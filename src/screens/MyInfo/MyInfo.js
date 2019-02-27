import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { ProfileFieldsView } from '~components';

const userFieldsQuery = gql`
  query MyInfoQuery {
    me {
      id
      ...ProfileFieldsView_user
    }
  }

  ${ProfileFieldsView.fragments.user}
`;

@graphql(userFieldsQuery)
@withNavigationFocus
export default class UserInfo extends Component {
  static navigationOptions = {
    title: 'Info',
  };

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { data: { loading, me } } = this.props;

    return <ProfileFieldsView loading={loading} user={me} />;
  }
}