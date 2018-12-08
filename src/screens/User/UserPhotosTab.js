import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { PhotoList } from 'components';

const userPhotosQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        photos {
          edges {
            ...PhotoList_edge
          }
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

@withNavigationFocus
export default class UserFriendsTab extends Component {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation, isFocused } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userPhotosQuery} variables={{ id }}>
        {({ loading, networkStatus, data }) => (
          <PhotoList
            edges={loading || !isFocused ? [] : data.user.photos.edges}
            networkStatus={!isFocused ? 1 : networkStatus} 
          />
        )}
      </Query>
    );
  }
}
