import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { ProfileFieldsView } from 'components';

const userFieldsQuery = gql`
  query MyInfoQuery {
    user: me {
      id
      ...ProfileFieldsView_user
    }
  }

  ${ProfileFieldsView.fragments.user}
`;

@withNavigationFocus
export default class UserInfo extends PureComponent {
  static navigationOptions = {
    title: 'Info',
  };

  render() {
    const { isFocused } = this.props;

    return (
      <Query skip={!isFocused} query={userFieldsQuery}>
        {({ data = {}, loading }) => (
          <ProfileFieldsView loading={loading || !isFocused} user={data.user} />
        )}
      </Query>
    );
  }
}