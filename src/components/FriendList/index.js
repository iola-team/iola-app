import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import FriendList from './FriendList';

const userQuery = gql`
  query UserFriendsQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        friends {
          edges {
            ...FriendList_edge
          }
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

export default class FriendListContainer extends Component {
  static displayName = 'Container(FriendList)';
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId: id, ...props } = this.props;

    return (
      <Query query={userQuery} variables={{ id }}>
        {({ loading, networkStatus, data: { user } }) => (
          <FriendList 
            {...props} 
            networkStatus={networkStatus} 
            edges={loading ? [] : user.friends.edges} 
          />
        )}
      </Query>
    );
  }
}