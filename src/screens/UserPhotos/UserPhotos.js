import React, { PureComponent } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { remove } from 'lodash';

import { withStyleSheet } from 'theme';
import { PhotoList, ImageView } from 'components';
import TabBarLabel from './TabBarLabel';

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

@withNavigationFocus
@withStyleSheet('Sparkle.UserPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
@graphql(userPhotosQuery, {
  options: ({ navigation }) => ({
    skip: props => !props.isFocused,
    variables: {
      id: navigation.state.params.id,
    },
  }),
})
@graphql(deletePhotoMutation, {
  name: 'deletePhoto',
})
export default class UserPhotos extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <TabBarLabel userId={navigation.state.params.id} />,
  });

  deletePhoto = (photoId) => {
    const { deletePhoto, data: { user } } = this.props;
    const optimisticResponse = {
      result: {
        __typename: 'UserPhotoDeletePayload',
        deletedId: photoId,
        user: {
          __typename: 'User',
          id: user.id,
        },
      },
    };
    const update = (cache, { data: { result: { deletedId } } }) => {
      const data = cache.readQuery({
        query: userPhotosQuery,
        variables: { id: user.id },
      });

      remove(data.user.photos.edges, edge => edge.node.id === deletedId);

      cache.writeQuery({
        query: userPhotosQuery,
        variables: { id: user.id },
        data,
      });
    };

    deletePhoto({
      variables: { id: photoId },
      optimisticResponse,
      update,
    });
  };

  render() {
    const { isFocused, data, styleSheet: styles } = this.props;
    const edges = data?.user?.photos.edges || [];
    const loading = data?.loading || false;

    return (
      <ImageView edges={edges} deletePhoto={this.deletePhoto}>
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
    );
  }
}
