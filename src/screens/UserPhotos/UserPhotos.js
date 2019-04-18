import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { remove } from 'lodash';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import { PhotoList, ImageView } from '~components';
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
    variables: {
      id: navigation.state.params.id,
    },
  }),
})
@graphql(deletePhotoMutation, {
  name: 'deletePhoto',
})
@withNavigationFocus
export default class UserPhotos extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <TabBarLabel userId={navigation.state.params.id} />,
  });

  state = {
    isRefreshing: false,
  };

  /**
   * TODO: Move these common logic to a central place, to prevent copy & past
   */
  refresh = async () => {
    const { data: { refetch } } = this.props;
    
    this.setState({ isRefreshing: true });
    try {
      await refetch({ cursor: null });
    } catch {
      // Pass...
    }
    this.setState({ isRefreshing: false });
  };

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

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { data: { user, loading }, styleSheet: styles } = this.props;
    const { isRefreshing } = this.state;
    const edges = user?.photos.edges || [];

    return (
      <Container>
        <ImageView edges={edges} deletePhoto={this.deletePhoto}>
          {onShowImage => (
            <PhotoList
              contentContainerStyle={styles.list}
              edges={edges}
              loading={loading}
              onItemPress={onShowImage}
              noContentText="No photos"
              noContentStyle={styles.noContent}
              refreshing={isRefreshing}
              onRefresh={this.refresh}

              /**
               * TODO: Review these optimizations
               */
              removeClippedSubviews
              initialNumToRender={6}
              updateCellsBatchingPeriod={100}
            />
          )}
        </ImageView>
      </Container>
    );
  }
}
