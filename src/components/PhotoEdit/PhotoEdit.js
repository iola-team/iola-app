import React, { Component } from 'react';
import { unionBy, uniqueId, clone, find, assign, findIndex } from 'lodash';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Image } from 'react-native';
import {
  View,
  Text,
  Button,
  Icon,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';
import PhotoGrid, { Item } from '../PhotoGrid';
import ImagePicker from '../ImagePicker';
import ImageProgress from '../ImageProgress';

function mergeSlots(prevSlots, nextSlots, by = 'id') {
  return nextSlots.reduce((slots, slot) => {
    const index = findIndex(slots, { [by]: slot[by] });
    const patch = index >= 0
      ? { [index]: { $merge: slot } }
      : { $unshift: [slot] };

    return update(slots, patch);
  }, prevSlots);
}

function createSlot({ id = uniqueId(), url, progress = 1 }, key) {
  return {
    id,
    key: key || id,
    url,
    progress,
  };
}

const userFragment = gql`
  fragment PhotoEdit_user on User {
    id
    photos {
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

  addButtonIcon: {
    color: '#FFFFFF',
    fontSize: 36,
  }
})
export default class PhotoEdit extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  static defaultProps = {

  };

  state = {
    slots: [],
  };

  static getDerivedStateFromProps({ user }, { slots }) {
    const {
      photos: {
        edges
      }
    } = user;

    return {
      slots: mergeSlots(
        slots,
        edges.map(edge => createSlot(edge.node)),
      ),
    };
  }

  addLoadingImages(images) {
    const { slots } = this.state;
    const newSlots = images.map(({ path }) => createSlot({
      url: path,
      progress: 0,
    }));

    this.setState({
      slots: mergeSlots(slots, newSlots),
    });

    return newSlots;
  }

  updateSlot(key, slot) {
    this.setState({
      slots: mergeSlots(this.state.slots, [{
        ...slot,
        key,
      }], 'key'),
    });
  }

  renderPhoto({ url, progress}) {
    const { styleSheet } = this.props;

    return (
      <Item>
        <ImageProgress
          style={styleSheet.itemContent}
          previewUrl={url}
          active={progress < 1}
          progress={progress}
        >
          <Image
            style={styleSheet.itemContent}
            source={{ uri: url }}
          />
        </ImageProgress>
      </Item>
    )
  }

  renderAddButton() {
    const { styleSheet, user } = this.props;

    return (
      <Item>
        <Mutation
          mutation={addPhotoMutation}
          ignoreResults
        >
          {(addPhoto) => (
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
                      uploadTime: new Date(),
                    },
                  },
                  update: (cache, { data: { addUserPhoto: result } }) => {
                    this.updateSlot(slot.key, createSlot(result.node));
                  }
                }));
              }}
            >
              {(pick) => (
                <Button
                  transparent
                  block
                  style={[styleSheet.itemContent, styleSheet.addButton]}
                  onPress={() => pick()}
                >
                  <Icon
                    name="add"
                    style={styleSheet.addButtonIcon}
                  />
                </Button>
              )}
            </ImagePicker>
          )}
        </Mutation>
      </Item>
    )
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
    const { style } = this.props;

    return (
      <PhotoGrid
        style={style}
        getItemKey={::this.getItemKey}
        renderItem={::this.renderItem}
      />
    );
  }
}
