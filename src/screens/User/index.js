import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { createHeadingTabsNavigator } from 'components';
import UserInfoTab from './UserInfoTab';
import UserFriendsTab from './UserFriendsTab';
import UserPhotosTab from './UserPhotosTab';
import UserScreenHead from './UserScreenHead';

const userQuery = gql`
  query UserDetailsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...UserScreenHead_user
    }
  }

  ${UserScreenHead.fragments.user}
`;

const renderHeader = ({ navigation }) => {
  const userId = navigation.state.params.id;

  return (
    <Query query={userQuery} variables={{ userId }}>
      {({ data }) => (
        <UserScreenHead navigation={navigation} user={data.user} />
      )}
    </Query>
  );
};

export {
  UserInfoTab,
  UserFriendsTab,
  UserPhotosTab,
};

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader,
});