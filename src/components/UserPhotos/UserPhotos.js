import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import PhotoList from '../PhotoList';

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

export default class UserPhotos extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId, ...props } = this.props;

    return (
      <Query query={userPhotosQuery} variables={{ id: userId }}>
        {({ loading, data: { user } }) => (loading ? null : (
          <ImageView images={user.photos.edges.map(({ node }) => ({ user, ...node }))}>
// RR
{onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
            <PhotoList
              {...props}
              edges={loading ? [] : user.photos.edges}
              loading={loading}
            />
          </ImageView>
        ))}
      </Query>
    );
  }
}
