import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { uniqueId, remove } from 'lodash';
import update from 'immutability-helper';

import { PhotoList, ImagePicker, ImageView } from '~components';

const myPhotosQuery = gql`
  query MyPhotosQuery {
    me {
      id
      photos {
        edges {
          ...PhotoList_edge
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

const addPhotoMutation = gql`
  mutation addUserPhotoMutation($input: UserPhotoCreateInput!) {
    result: addUserPhoto(input: $input) {
      user {
        id
        ...PhotosTabBarLabel_user
      }
      edge {
        ...PhotoList_edge
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

const deletePhotoMutation = gql`
  mutation deleteUserPhotoMutation($id: ID!) {
    result: deleteUserPhoto(id: $id) {
      deletedId
    }
  }
`;

@graphql(myPhotosQuery, {
  skip: props => !!props.skip,
})
@graphql(addPhotoMutation, {
  name: 'addPhoto',
})
@graphql(deletePhotoMutation, {
  name: 'deletePhoto',
})
export default class MyFriendsConnection extends PureComponent {
  static propTypes = {
    addButtonStyle: PropTypes.object.isRequired,
    data: PropTypes.object,
    skip: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    skip: false,
  };

  state = {
    photoProgress: {},
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

  setPhotoProgress = (id, progress) => this.setState(state => ({
    photoProgress: {
      ...state.photoProgress,
      [id]: progress,
    },
  }));

  deletePhoto = (photoId) => {
    const { deletePhoto, data: { me } } = this.props;
    const optimisticResponse = {
      result: {
        __typename: 'UserPhotoDeletePayload',
        deletedId: photoId,
        user: {
          __typename: 'User',
          id: me.id,
        },
      },
    };
    const update = (cache, { data: { result: { deletedId } } }) => {
      const data = cache.readQuery({ query: myPhotosQuery });

      remove(me.photos.edges, edge => edge.node.id === deletedId);

      cache.writeQuery({
        query: myPhotosQuery,
        data,
      });
    };

    deletePhoto({
      variables: { id: photoId },
      optimisticResponse,
      update,
    });
  };

  addPhoto = async (image) => {
    const { addPhoto, data: { me } } = this.props;
    const variables = {
      input: {
        userId: me.id,
        file: image.blob,
        uploadTime: (new Date()).toISOString(),
      },
    };

    const id = uniqueId('OptimisiticPhoto:');
    const edge = PhotoList.createOptimisticEdge({ url: image.path, id });
    const optimisticResponse = { result: { __typename: 'UserPhotoCreatePayload', edge, user: me } };

    this.setPhotoProgress(id, 0);

    addPhoto({
      variables,
      optimisticResponse,
      context: {
        fetchOptions: {
          uploadProgress: (received, total) => {
            this.setPhotoProgress(id, received / total);
          },
        },
      },
      update: async (cache, { data: { result } }) => {
        const data = cache.readQuery({ query: myPhotosQuery });

        cache.writeQuery({
          query: myPhotosQuery,
          data: update(data, {
            me: {
              photos: {
                edges: { $unshift: [result.edge] },
              },
            },
          }),
        });
      },
    });
  };

  onChange = images => images.map(this.addPhoto);

  render() {
    const { data: { loading, me }, skip, addButtonStyle, ...props } = this.props;
    const { photoProgress, isRefreshing } = this.state;
    const edges = me?.photos.edges || [];

    return (
      <>
        <ImageView edges={edges} deletePhoto={this.deletePhoto}>
          {onShowImage => (
            <PhotoList
              {...props}

              refreshing={isRefreshing}
              onRefresh={this.refresh}
              itemsProgress={photoProgress}
              onItemPress={onShowImage}
              edges={edges}
              loading={skip || loading}
              noContentText="No photos"
            />
          )}
        </ImageView>

        <ImagePicker multiple onChange={this.onChange}>
          {({ pick }) => (
            <Button block rounded style={addButtonStyle} onPress={pick}>
              <Icon name="add" />
            </Button>
          )}
        </ImagePicker>
      </>
    );
  }
}