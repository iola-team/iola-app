import React, { Component } from 'react';
import { get, uniqueId, find, findIndex, without, noop } from 'lodash';
import update from 'immutability-helper';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Image } from 'react-native';
import { View, Text, Button, Card, CardItem } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import PhotoGrid, { Item } from '../PhotoGrid';
import ImagePicker from '../ImagePicker';
import ImageProgress from '../ImageProgress';
import ActionSheet from '../ActionSheet';
import Icon from '../Icon';

function mergeSlots(prevSlots, nextSlots, by = 'id') {
  return nextSlots.reduce((slots, slot) => {
    const index = findIndex(slots, { [by]: slot[by] });
    const { url, ...partialSlot } = slot;
    const patch = index >= 0
      ? { [index]: { $merge: partialSlot } }
      : { $unshift: [slot] };

    return update(slots, patch);
  }, prevSlots);
}

function createSlot({ id = uniqueId(), url, progress = 1, loading = false }, key) {
  return {
    id,
    key: key || id,
    url,
    progress,
    loading,
  };
}

const userFragment = gql`
  fragment PhotoEdit_user on User {
    id
    photos {
      totalCount
      edges {
        cursor
        node {
          id
          url
        }
      }
    }
  }
`;

const addPhotoMutation = gql`
  mutation addUserPhotoMutation($input: UserPhotoCreateInput!) {
    addUserPhoto(input: $input) {
      node {
        id
        url
      }
      user {
        ...PhotoEdit_user
      }
    }
  }

  ${userFragment}
`;

const deletePhotoMutation = gql`
  mutation deleteUserPhotoMutation($id: ID!) {
    deleteUserPhoto(id: $id) {
      deletedId
      user {
        ...PhotoEdit_user
      }
    }
  }
  
  ${userFragment}
`;

@styleSheet('Sparkle.PhotoEdit', {
  itemContent: {
    flex: 1,
  },

  addButton: {
    backgroundColor: '#DDE2EE',
  },

  itemButton: {
    flex: 1,
    alignItems: 'stretch',
    borderRadius: 0,
    paddingVertical: 0,
  },

  addButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  gridWrap: {
    flex: 1,
  },
})
export default class PhotoEdit extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  static defaultProps = {

  };

  state = {
    slots: [],
  };

  static getDerivedStateFromProps({ user }, { slots }) {
    const edges = get(user, 'photos.edges', []);
    const newSlots = edges.map(edge => createSlot(edge.node));

    newSlots.reverse();

    return {
      slots: mergeSlots(slots, newSlots),
    };
  }

  addLoadingImages(images) {
    const { slots } = this.state;
    const newSlots = images.map(({ path }) => createSlot({
      url: path,
      loading: true,
      progress: 0,
    }));

    this.setState({
      slots: mergeSlots(slots, newSlots),
    });

    return newSlots;
  }

  emptySlot(slot) {
    const { slots } = this.state;

    this.setState({
      slots: without(slots, slot),
    });
  }

  updateSlot({ key }, slot) {
    const { slots } = this.state;

    if (!find(slots, { key })) {
      return;
    }

    this.setState({
      slots: mergeSlots(slots, [{
        ...slot,
        key,
      }], 'key'),
    });
  }

  renderPhoto(slot) {
    const { styleSheet } = this.props;
    const { key, id, url, progress, loading } = slot;

    return (
      <Item>
        <ImageProgress
          style={styleSheet.itemContent}
          previewUrl={url}
          active={loading}
          progress={progress}
        >
          <Mutation
            mutation={deletePhotoMutation}
            variables={{ id }}
          >
            {deletePhoto => (
              <ActionSheet
                options={[
                  'Cancel',
                  'Delete',
                ]}
                cancelButtonIndex={0}
                destructiveButtonIndex={1}
                onPress={index => {
                  if (index === 1) {
                    deletePhoto();

                    this.emptySlot(slot);
                  }
                }}
              >
                {show => (
                  <Button
                    transparent
                    block
                    style={styleSheet.itemButton}
                    onPress={show}
                  >
                    <Image
                      style={styleSheet.itemContent}
                      source={{ uri: url }}
                    />
                  </Button>
                )}
              </ActionSheet>
            )}
          </Mutation>
        </ImageProgress>
      </Item>
    );
  }

  renderAddButton() {
    const { styleSheet, user } = this.props;

    return (
      <Item>
        <Mutation
          mutation={addPhotoMutation}
          ignoreResults
        >
          {addPhoto => (
            <ImagePicker
              multiple
              width={1000}
              height={1000}
              onChange={(images) => {
                this.addLoadingImages(images).map((slot, index) => addPhoto({
                  variables: {
                    input: {
                      userId: user.id,
                      file: images[index].blob,
                      uploadTime: (new Date()).toISOString(),
                    },
                  },
                  context: {
                    fetchOptions: {
                      uploadProgress: (received, total) => {
                        this.updateSlot(slot, {
                          progress: received / total,
                        });
                      },
                    },
                  },
                  update: (cache, { data: { addUserPhoto: result } }) => {
                    this.updateSlot(slot, createSlot({
                      ...result.node,
                      url: slot.url,
                    }));
                  },
                }).catch(noop));
              }}
            >
              {({ pick }) => (
                <Button
                  transparent
                  block
                  style={[styleSheet.itemContent, styleSheet.addButton]}
                  onPress={() => pick()}
                >
                  <Icon name="plus" style={styleSheet.addButtonIcon} />
                </Button>
              )}
            </ImagePicker>
          )}
        </Mutation>
      </Item>
    );
  }

  renderItem(index) {
    const { slots } = this.state;
    const slot = slots[index];

    if (slot) {
      return this.renderPhoto(slot);
    }

    if (slots.length === index) {
      return this.renderAddButton();
    }

    return (
      <Item placeholder />
    );
  }

  getItemKey(index) {
    const { slots } = this.state;

    return slots[index] && slots[index].key;
  }

  render() {
    const { style, styleSheet, user: { photos } } = this.props;

    return (
      <Card
        style={style}
        transparent
      >
        <CardItem header padder>
          <Text>Photos {photos.totalCount}</Text>
        </CardItem>
        <CardItem>
          <View
            highlight
            padder
            style={styleSheet.gridWrap}
          >
            <PhotoGrid
              getItemKey={::this.getItemKey}
              renderItem={::this.renderItem}
            />
          </View>
        </CardItem>
      </Card>
    );
  }
}
