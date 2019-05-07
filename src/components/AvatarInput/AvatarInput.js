import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { Text, View, Button } from 'native-base';

import { withStyleSheet } from '~theme';
import ImagePicker from '../ImagePicker';
import Placeholder from '../Placeholder';
import ActionSheet from '../ActionSheet';

@withStyleSheet('Sparkle.AvatarInput', {
  root: {
    flexDirection: 'row',
  },

  imageHolder: {
    borderRadius: 8,
    overflow: 'hidden',
  },

  image: {
    width: 80,
    height: 80,
  },

  placeholder: {
    color: '#FFFFFF',
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
    loading: PropTypes.bool, 
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    value: undefined,
    defaultValue: undefined,
    onChange: () => {},
    onDelete: () => {},
  };

  actionSheet = React.createRef();
  state = {
    image: undefined,
  }

  static getDerivedStateFromProps({ defaultValue }, { image }) {
    return {
      image: image === undefined ? defaultValue : image,
    };
  }

  onImageChange = ([selectedImage]) => {
    this.setState({
      image: selectedImage?.path,
    });

    this.props.onChange(selectedImage);
  }

  onDeletePress = () => this.actionSheet.current.show();
  onDelete = (reset) => {
    const { onDelete } = this.props;

    reset();
    onDelete();

    this.setState({ image: null });
  };

  renderInput({ pick, reset }) {
    const { style, styleSheet: styles, loading, value } = this.props;
    const { image } = this.state;

    /**
     * TODO: use correct default avatar image
     */
    const defaultAvatarImage = 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';
    const resultImage = value === undefined ? image : value;
    const showLoading = !resultImage && loading;
    const avatarUrl = resultImage || defaultAvatarImage;

    return (
      <View style={[styles.root, style]}>
        <View style={styles.imageHolder}>
          {showLoading
            ? <Placeholder style={[styles.image, styles.placeholder]} />
            : <Image style={styles.image} source={{ uri: avatarUrl }} />
          }
        </View>

        <View style={styles.rightSection} horizontalPadder>
          <Text note>
            Edit profile photo
          </Text>

          {!showLoading && (
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
                      onPress={this.onDeletePress}
                    >
                      <Text>Delete</Text>
                    </Button>

                    <ActionSheet
                      ref={this.actionSheet}
                      title="Are you sure?"
                      message="This action cannot be undone!"
                      options={[
                        'Cancel',
                        'Delete Avatar',
                      ]}

                      cancelButtonIndex={0}
                      destructiveButtonIndex={1}
                      onPress={(buttonIndex) => buttonIndex && this.onDelete(reset)}
                    />
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
        onChange={this.onImageChange}
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
