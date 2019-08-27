import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { uniqueId } from 'lodash';
import update from 'immutability-helper';
import { withNavigationFocus } from 'react-navigation';
import { shouldUpdate } from 'recompose';

import { PhotoList, ImagePicker, ImageView, Icon } from '~components';
import { withStyleSheet as styleSheet } from '~theme';

const myPhotosQuery = gql`
  query MyPhotosQuery {
    me {
      id
      name
      photos {
        edges {
          ...PhotoList_edge
          ...ImageView_edge
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
  ${ImageView.fragments.edge}
`;

const addPhotoMutation = gql`
  mutation addUserPhotoMutation($input: UserPhotoCreateInput!) {
    result: addUserPhoto(input: $input) {
      edge {
        ...PhotoList_edge
        ...ImageView_edge
      }
    }
  }

  ${PhotoList.fragments.edge}
  ${ImageView.fragments.edge}
`;

const deletePhotoMutation = gql`
  mutation deleteUserPhotoMutation($id: ID!) {
    result: deleteUserPhoto(id: $id) {
      deletedId
    }
  }
`;

@styleSheet('iola.MyPhotosConnection', {
  addButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
})
@graphql(myPhotosQuery, {
  skip: props => !!props.skip,
})
@graphql(addPhotoMutation, {
  name: 'addPhoto',
})
@graphql(deletePhotoMutation, {
  name: 'deletePhoto',
})
@withNavigationFocus
@shouldUpdate((props, nextProps) => nextProps.isFocused)
export default class MyPhotosConnection extends PureComponent {
  static propTypes = {
    addButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
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

    deletePhoto({
      variables: { id: photoId },
      optimisticResponse,
      update: (cache, { data: { result: { deletedId } } }) => {
        const cachedData = cache.readQuery({ query: myPhotosQuery });
        const data = update(cachedData, {
          me: {
            photos: {
              edges: {
                $set: cachedData.me.photos.edges.filter(({ node }) => node.id !== deletedId),
              },
            },
          },
        });

        cache.writeQuery({
          query: myPhotosQuery,
          data,
        });
      },
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
    const optimisticResponse = {
      result: {
        __typename: 'UserPhotoCreatePayload',
        edge: ImageView.createOptimisticEdge({
          edge,
          user: me,
          photo: {
            id,
            url: image.path,
          },
        }),
        user: me,
      },
    };

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
    const { data: { loading, me }, skip, addButtonStyle, styleSheet: styles, ...props } = this.props;
    const { photoProgress, isRefreshing } = this.state;
    const edges = me?.photos.edges;

    return (
      <>
        <ImageView edges={edges || []} deletePhoto={this.deletePhoto}>
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
              <Icon name="plus" style={styles.addButtonIcon} />
            </Button>
          )}
        </ImagePicker>
      </>
    );
  }
}