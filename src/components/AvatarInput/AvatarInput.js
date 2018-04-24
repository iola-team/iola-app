import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Alert } from 'react-native';
import {
  Text,
  View,
  Button as NBButton,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import ImagePicker from '../ImagePicker';

const Root = connectToStyleSheet('root', View);
const Button = connectToStyleSheet('button', NBButton).withProps({
  block: true,
});
const AvatarImage = connectToStyleSheet('image', Image);
const Right = connectToStyleSheet('rightSection', View);
const Buttons = connectToStyleSheet('buttons', View);

@styleSheet('Sparkle.AvatarInput', {
  root: {
    flexDirection: 'row',
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
  };

  static defaultProps = {
    value: undefined,
    defaultValue: undefined,
    onChange: () => {},
  };

  state = {
    image: undefined,
  }

  static getDerivedStateFromProps({ defaultValue }, { image }) {
    return {
      image: image === undefined ? defaultValue : image.path,
    }
  }

  onImageChange([selectedImage]) {
    const image = selectedImage ? selectedImage.path : null;

    this.setState({ image });

    this.props.onChange(selectedImage);
  }

  onDeletePress(reset) {
    Alert.alert(
      'Are you sure?',
      'This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: reset, style: 'destructive' },
      ],
      {
        cancelable: false
      },
    );
  }

  renderInput({ pick, reset }) {
    const { style, value } = this.props;
    const { image } = this.state;

    /**
     * TODO: use correct default avatar image
     */
    const defaultAvatarImage = 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';
    const resultImage = value === undefined ? image : value;
    const avatarUrl = resultImage || defaultAvatarImage;

    return (
      <Root style={style}>
        <AvatarImage source={{ uri: avatarUrl }} />
        <Right horizontalPadder>
          <Text note>
            Edit profile photo
          </Text>
          <Buttons>
            {
              resultImage ? (
                <Fragment>
                  <Button onPress={pick}>
                    <Text>Change</Text>
                  </Button>

                  <Button
                    secondary
                    bordered
                    onPress={() => this.onDeletePress(reset)}
                  >
                    <Text>Delete</Text>
                  </Button>
                </Fragment>
              ) : (
                <Button onPress={pick}>
                  <Text>Add</Text>
                </Button>
              )
            }
          </Buttons>
        </Right>
      </Root>
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
        {(pick, [image], reset) => this.renderInput({
          pick,
          image,
          reset,
        })}
      </ImagePicker>
    );
  }
}
