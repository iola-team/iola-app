import React, { Component } from 'react';
import { unionBy, uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
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

function mergeSlots(slots, nextSlots) {
  return unionBy(nextSlots, slots, 'key').slice(0, 8);
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

    const loadedSlots = edges.map(({ node }) => ({
      progress: 1,
      key: node.id,
      url: node.url,
    }));

    return {
      slots: mergeSlots(slots, loadedSlots),
    };
  }

  pickerOnChange(images) {
    const { slots } = this.state;
    const newSlots = images.map(({ path }) => ({
      progress: 0.3,
      key: uniqueId(),
      url: path,
    }));

    this.setState({
      slots: mergeSlots(slots, newSlots),
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
    const { styleSheet } = this.props;

    return (
      <Item>
        <ImagePicker
          multiple
          width={1000}
          height={1000}
          onChange={::this.pickerOnChange}
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
