import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { PropTypes } from 'prop-types';

import ImageView from '../ImageView';
import UserPhotosCard from '../UserPhotosCard';

const userPhotosQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        name
        photos {
          totalCount
          edges {
            node {
              id
              url
              caption
              createdAt
            }
          }
        }
      }
    }
  }
`;

export default class UserPhotos extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId } = this.props;

    return (
      <Query query={userPhotosQuery} variables={{ id: userId }}>
        {({ loading, data: { user } }) => (loading ? null : (
          <ImageView images={user.photos.edges.map(({ node }) => ({ name: user.name, ...node }))}>
            {onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
          </ImageView>
        ))}
      </Query>
    );
  }
}
