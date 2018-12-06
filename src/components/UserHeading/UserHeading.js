import React, { PureComponent } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  View,
  Icon,
  Button,
  Text,
  H2,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import UserAvatar from '../UserAvatar';

const userFragment = gql`
  fragment UserHeading_user on User {
    id
    name
    info {
      headline
    }
    
    ...UserAvatar_user
  }
  
  ${UserAvatar.fragments.user}
`;

@styleSheet('Sparkle.UserHeading', {
  root: {
    alignItems: 'center',
  },

  avatar: {
    marginBottom: 25,
  },

  buttons: {
    flexDirection: 'row',
  },

  infoLine: {
    textAlign: 'center',
  },

  infoLine1: {
    marginBottom: 5,
  },

  infoLine2: {
    marginBottom: 25,
    color: '#BDC0CB',
  },

  button: {
    width: '30%',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
})
export default class UserHeading extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    onChatPress: PropTypes.func.isRequired,
  }

  render() {
    const { style, styleSheet, user, onChatPress } = this.props;

    return (
      <View style={[styleSheet.root, style]}>
        <UserAvatar style={styleSheet.avatar} user={user} size={'large'} />
        <H2 style={[styleSheet.infoLine, styleSheet.infoLine1]}>
          {user.name}
        </H2>
        <Text note style={[styleSheet.infoLine, styleSheet.infoLine2]}>
          {user.info && user.info.headline}
        </Text>

        <View style={styleSheet.buttons}>
          <Button block style={styleSheet.button} onPress={onChatPress}>
            <Text>Chat</Text>
          </Button>

          <Button light bordered secondary block style={styleSheet.button} onPress={() => {}}>
            <Text>Friends</Text>
          </Button>
        </View>
      </View>
    );
  }
}
