import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get, filter, uniqueId } from 'lodash';
import update from 'immutability-helper';
import { Button, Icon } from 'native-base';

import { PhotoList, ImagePicker, ImageProgress } from 'components';

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
export default class MyFriendsConnection extends Component {
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
  };

  setPhotoProgress = (id, progress) => this.setState(state => ({
    photoProgress: {
      ...state.photoProgress,
      [id]: progress,
    },
  }));

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
    const optimisticResponse = { result: { __typename: 'UserPhotoCreatePayload', edge } };

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
  }

  onChange = (images) => {
    images.map(this.addPhoto);
  };

  render() {
    const { data: { loading, me }, skip, addButtonStyle, ...props } = this.props;
    const { photoProgress } = this.state;
    const edges = me?.photos.edges || [];

    return (
      <>
        <PhotoList
          {...props}
          renderItem={this.renderItem}
          itemsProgress={photoProgress}
          edges={edges}
          loading={skip || loading}
          noContentText="No photos"
        />
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