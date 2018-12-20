import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import PhotoList from '../PhotoList';
import ImageView from '../ImageView';

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
        {({ loading, data }) => {
          const edges = loading ? [] : data.user.photos.edges;

          return (
            <ImageView edges={edges}>
              {onShowImage => (
                <PhotoList
                  {...props}
                  edges={edges}
                  loading={loading}
                  onItemPress={onShowImage}
                />
              )}
            </ImageView>
          );
        }}
      </Query>
    );
  }
}
