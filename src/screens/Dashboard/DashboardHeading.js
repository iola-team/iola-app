import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { UserHeading } from 'components';
import * as routes from '../roteNames';

const userQuery = gql`
  query DashboardHeadingQuery {
    user: me {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

export default class DashboardHeading extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  render() {
    const { navigation: { goBack, navigate }, ...props } = this.props;

    return (
      <Query query={userQuery}>
        {({ data: { user }, loading }) => (
          <UserHeading {...props} highlight loading={loading} user={user} />
        )}
      </Query>
    );
  }
}
