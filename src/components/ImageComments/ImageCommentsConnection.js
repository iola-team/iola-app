import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';
import { get } from 'lodash';

import ImageCommentsList from '../ImageCommentsList';

const photoCommentsQuery = gql`
  query photoCommentsQuery($id: ID!, $cursor: Cursor = null) {
    photo: node(id: $id) {
      ...on Photo {
        id
        comments(first: 10 after: $cursor) {
          edges {
            ...ImageCommentsList_edge
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }

  ${ImageCommentsList.fragments.edge}
`;

export default class ImageCommentsConnection extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    onItemPress: PropTypes.func,
    photoCommentsQuery: graphqlPropType(photoCommentsQuery),
  };

  static defaultProps = {
    onItemPress: () => {},
  };

  static queries = {
    photoCommentsQuery,
  };

  state = {
    loading: false,
  };

  handleLoadMore({ photo: { comments: { pageInfo } } }, fetchMore) {
    this.setState({ loading: pageInfo.hasNextPage });

    if (!pageInfo.hasNextPage) return;

    this.fetchMorePromise = this.fetchMorePromise || fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },

      updateQuery: (previousResult, { fetchMoreResult: { photo } }) => {
        const { comments } = photo;

        if (!comments || !comments.edges.length) {
          return previousResult;
        }

        return {
          photo: {
            ...previousResult.photo,
            comments: {
              ...previousResult.photo.comments,
              edges: [
                ...previousResult.photo.comments.edges,
                ...comments.edges
              ],
              pageInfo: {
                ...previousResult.photo.comments.pageInfo,
                ...comments.pageInfo
              },
            },
          },
        };
      }
    }).then(() => {
      this.fetchMorePromise = null;
      this.setState({ loading: false });
    });
  }

  render() {
    const { photoId, height, onItemPress } = this.props;

    return (
      <Query query={photoCommentsQuery} variables={{ id: photoId }}>
        {({ loading, data, fetchMore, networkStatus }) => {
          const refreshing = (
            loading ||
            this.state.loading ||
            networkStatus === NetworkStatus.refetch
          );
          const edges = get(data, 'photo.comments.edges', []);

          return (
            <ImageCommentsList
              photoId={photoId}
              height={height}
              onItemPress={onItemPress}
              refreshing={refreshing}
              edges={edges}
              onRefresh={data.refetch}
              onEndReached={() => this.handleLoadMore(data, fetchMore)}
              onEndReachedThreshold={2}
              inverted={!!edges.length || (refreshing && !edges.length)}
            />
          );
        }}
      </Query>
    );
  }
}
