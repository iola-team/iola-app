import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Image, Alert } from 'react-native';
import { Text, View, Button } from 'native-base';

import { withStyleSheet } from 'theme';
import ImagePicker from '../ImagePicker';
import Placeholder from '../Placeholder';

@withStyleSheet('Sparkle.AvatarInput', {
  root: {
    flexDirection: 'row',
  },

  imageHolder: {
    backgroundColor: '#F0F2F7',
    borderRadius: 8,
    overflow: 'hidden',
  },

  image: {
    width: 80,
    height: 80,
  },

  buttons: {
    flexDirection: 'row',
  },

  button: {
    marginRight: 8,
    width: 96,
  },

  rightSection: {
    justifyContent: 'space-between',
  }
})
export default class AvatarInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    value: undefined,
    defaultValue: undefined,
    onChange: () => {},
    onDelete: () => {},
  };

  state = {
    image: undefined,
  }

  static getDerivedStateFromProps({ defaultValue }, { image }) {
    return {
      image: image === undefined ? defaultValue : image,
    };
  }

  onImageChange([selectedImage]) {
    this.setState({
      image: get(selectedImage, 'path'),
    });

    this.props.onChange(selectedImage);
  }

  onDeletePress(reset) {
    const { onDelete } = this.props;

    Alert.alert(
      'Are you sure?',
      'This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => reset().then(onDelete),
          style: 'destructive'
        },
      ],
      {
        cancelable: false
      },
    );
  }

  renderInput({ pick, reset }) {
    const { style, styleSheet: styles, loading, value } = this.props;
    const { image } = this.state;

    /**
     * TODO: use correct default avatar image
     */
    const defaultAvatarImage = 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';
    const resultImage = value === undefined ? image : value;
    const avatarUrl = resultImage || defaultAvatarImage;

    return (
      <View style={[styles.root, style]}>
        <View style={styles.imageHolder}>
          {loading 
            ? <Placeholder style={styles.image} /> 
            : <Image style={styles.image} source={{ uri: avatarUrl }} />
          }
        </View>
        
        <View style={styles.rightSection} horizontalPadder>
          <Text note>
            Edit profile photo
          </Text>

          {!loading && (
            <View style={styles.buttons}>
              {
                resultImage ? (
                  <>
                    <Button style={styles.button} block onPress={pick}>
                      <Text>Change</Text>
                    </Button>

                    <Button
                      style={styles.button}
                      block
                      secondary
                      bordered
                      onPress={() => this.onDeletePress(reset)}
                    >
                      <Text>Delete</Text>
                    </Button>
                  </>
                ) : (
                  <Button style={styles.button} block onPress={pick}>
                    <Text>Add</Text>
                  </Button>
                )
              }
            </View>
          )}
          
        </View>
      </View>
    );
  }

  render() {
    return (
      <ImagePicker
        crop
        width={500}
        height={500}
        onChange={::this.onImageChange}
      >
        {({ pick }, [image], reset) => this.renderInput({
          pick,
          image,
          reset,
        })}
      </ImagePicker>
    );
  }
}
