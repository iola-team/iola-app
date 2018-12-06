import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import UserList from '../UserList';

const userQuery = gql`
  query UserFriendsQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        friends {
          edges {
            ...UserList_edge
          }
        }
      }
    }
  }
  
  ${UserList.fragments.edge}
`;

export default class FriendList extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId: id, ...props } = this.props;

    return (
      <Query query={userQuery} variables={{ id }}>
        {({ loading, networkStatus, data: { user } }) => (
          <UserList
            {...props}
            edges={loading ? [] : user.friends.edges}
            networkStatus={networkStatus} 
          />
        )}
      </Query>
    );
  }
}