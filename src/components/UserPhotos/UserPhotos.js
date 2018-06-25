import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { PropTypes } from 'prop-types';

import ImageView from '../ImageView';
import UserPhotosCard from '../UserPhotosCard';

const userFragment = gql`
  fragment UserPhotos_user on User {
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
`;

@graphql(gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...UserPhotos_user
    }
  }

  ${userFragment}
`, {
  options: ({ userId }) => ({
    variables: {
      id: userId,
    },
  }),
})
export default class UserPhotos extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { data: { user, loading } } = this.props;

    return loading ? null : (
      <ImageView images={user.photos.edges.map(({ node }) => ({ name: user.name, ...node }))}>
        {onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
      </ImageView>
    );
  }
}
