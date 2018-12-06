import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { PropTypes } from 'prop-types';

import PhotoList from '../PhotoList';

const userPhotosQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        photos {
          totalCount
          edges {
            ...PhotoList_edge
          }
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

export default class UserPhotos extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId } = this.props;

    return (
      <Query query={userPhotosQuery} variables={{ id: userId }}>
        {({ loading, networkStatus, data: { user } }) => (
          <PhotoList edges={loading ? [] : user.photos.edges} networkStatus={networkStatus} />
        )}
      </Query>
    );
  }
}
