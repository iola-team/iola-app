import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import {
  Text,
  View,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.AvatarToolbar', {
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
export default class AvatarToolbar extends PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    onButtonPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    imageUrl: null,
  };

  onPress(action) {
    this.props.onButtonPress(action);
  }

  render() {
    const { styleSheet, style, imageUrl } = this.props;
    const avatarUrl = imageUrl || 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';
    const hasAvatar = !!imageUrl;

    return (
      <View style={[styleSheet.root, style]}>
        <Image style={styleSheet.image} source={{ uri: avatarUrl }} />
        <View horizontalPadder style={styleSheet.rightSection}>
          <Text note>
            Edit profile photo
          </Text>
          <View style={styleSheet.buttons}>
            {
              hasAvatar ? (
                <Fragment>
                  <Button
                    block
                    style={styleSheet.button}
                    onPress={this.onPress.bind(this, 'change')}
                  >
                    <Text>Change</Text>
                  </Button>

                  <Button
                    block
                    secondary
                    bordered
                    style={styleSheet.button}
                    onPress={this.onPress.bind(this, 'delete')}
                  >
                    <Text>Delete</Text>
                  </Button>
                </Fragment>
              ) : (
                <Button
                  block
                  style={styleSheet.button}
                  onPress={this.onPress.bind(this, 'add')}
                >
                  <Text>Add</Text>
                </Button>
              )
            }
          </View>
        </View>
      </View>
    );
  }
}
