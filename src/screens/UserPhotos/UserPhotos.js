import React, { PureComponent } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { remove } from 'lodash';

import { withStyleSheet } from 'theme';
import { PhotoList, ImageView } from 'components';

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

const deletePhotoMutation = gql`
  mutation deleteUserPhotoMutation($id: ID!) {
    result: deleteUserPhoto(id: $id) {
      deletedId
      user {
        id
      }
    }
  }
`;

@withStyleSheet('Sparkle.UserPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
@withNavigationFocus
export default class UserPhotos extends PureComponent {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation, isFocused, styleSheet: styles } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userPhotosQuery} variables={{ id }}>
        {({ loading, data }) => {
          const edges = loading || !isFocused ? [] : data.user.photos.edges;
          const update = (cache, { data: { result: { deletedId } } }) => {
            const data = cache.readQuery({
              query: userPhotosQuery,
              variables: { id },
            });

            remove(data.user.photos.edges, edge => edge.node.id === deletedId);

            cache.writeQuery({
              query: userPhotosQuery,
              variables: { id },
              data,
            });
          };
          const optimisticResponse = photoId => ({
            result: {
              __typename: 'UserPhotoDeletePayload',
              deletedId: photoId,
              user: {
                __typename: 'User',
                id,
              },
            },
          });

          return (
            <Mutation mutation={deletePhotoMutation} update={update}>
              {deletePhoto => (
                <ImageView
                  edges={edges}
                  deleteMutation={{ mutate: deletePhoto, optimisticResponse }}
                >
                  {onShowImage => (
                    <PhotoList
                      contentContainerStyle={styles.list}
                      edges={edges}
                      loading={loading || !isFocused}
                      onItemPress={onShowImage}
                      noContentText="No photos"
                      noContentStyle={styles.noContent}
                    />
                  )}
                </ImageView>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
