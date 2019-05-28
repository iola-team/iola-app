import React, { PureComponent } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { View, Button, Text, H2 } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Image from '../Image';

const userFragment = gql`
  fragment DashboardHeading_user on User {
    id
    name
    avatar {
      id
      url(size: MEDIUM)
    }
    info {
      headline
    }
  }
`;

@styleSheet('Sparkle.DashboardHeading', {
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#F3F4F7',
  },

  content: {
    width: 240,
    alignItems: 'stretch',
  },

  info: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },

  infoLine: {
    textAlign: 'center',
  },

  name: {
    marginBottom: 5,
    color: '#585A61',
  },

  headline: {},

  image: {
    height: 240,
    borderRadius: 8,
    marginBottom: 24,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: 117,
  },

  buttonText: {
    color: '#45474F',
  }
})
export default class DashboardHeading extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    onEditPress: PropTypes.func.isRequired,
    onSettingsPress: PropTypes.func.isRequired,
  }

  render() {
    const { style, styleSheet, user, onEditPress, onSettingsPress } = this.props;

    const avatarUrl = user.avatar
      ? user.avatar.url
      : 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';

    return (
      <View style={[style, styleSheet.root]}>
        <View style={styleSheet.content}>
          <View style={styleSheet.info}>
            <H2 inverse style={[styleSheet.infoLine, styleSheet.name]}>
              {user.name}
            </H2>
            <Text secondary style={[styleSheet.infoLine, styleSheet.headline]}>
              {user.info.headline}
            </Text>
          </View>

          <Image source={{ uri: avatarUrl }} style={styleSheet.image} />

          <View style={styleSheet.buttons}>
            <Button block bordered transparent style={styleSheet.button} onPress={onEditPress}>
              <Text style={styleSheet.buttonText}>Edit Profile</Text>
            </Button>

            <Button block bordered transparent style={styleSheet.button} onPress={onSettingsPress}>
              <Text style={styleSheet.buttonText}>Settings</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
