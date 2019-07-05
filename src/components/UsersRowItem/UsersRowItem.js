import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { onlyUpdateForKeys, hoistStatics } from 'recompose';
import LinearGradient from 'react-native-linear-gradient';
import { View as ViewRN, StyleSheet } from 'react-native';
import { View, Text } from 'native-base';

import { withStyle } from '~theme';
import UserAvatar from '../UserAvatar';
import Placeholder from '../Placeholder';
import Touchable from '../TouchableOpacity';

const userFragment = gql`
  fragment UsersRowItem_user on User {
    id
    name
    ...UserAvatar_user
  }

  ${UserAvatar.fragments.user}
`;

@withStyle('Sparkle.UsersRowItem', {
  width: 68,
  marginVertical: 5,

  'Sparkle.TouchableOpacity': {
    alignItems: 'center',

    'Sparkle.UserAvatar': {
      marginBottom: 6,
    },

    'NativeBase.ViewNB': {
      overflow: 'hidden',
      marginHorizontal: 5,
      alignSelf: 'stretch',
      alignItems: 'center',

      'NativeBase.Text': {
        fontSize: 12,
      },
    },
  },

  'Sparkle.Placeholder': {
    alignItems: 'center',

    'NativeBase.ViewNB': {
      backgroundColor: '#F3F4F7',

      '.avatar': {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginBottom: 6,
      },

      '.name': {
        height: 12,
        alignSelf: 'stretch',
        borderRadius: 4,
        marginHorizontal: 5,
      },
    },
  },
})
@hoistStatics(onlyUpdateForKeys(['user', 'style']))
export default class UserListItem extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    onPress: () => {},
  };

  renderPlaceholder() {
    const { style } = this.props;

    return (
      <Placeholder style={style}>
        <View avatar />
        <View name />
      </Placeholder>
    );
  }

  onPress = () => requestAnimationFrame(() => {
    const { onPress, user } = this.props;

    return onPress(user);
  });

  render() {
    const { user, ...props } = this.props;

    if (!user) {
      return this.renderPlaceholder();
    }

    return (
      <ViewRN {...props}>
        <Touchable onPress={this.onPress}>
          <UserAvatar size="medium" user={user} foreground />
          <View>
            <Text numberOfLines={1} ellipsizeMode="clip">{user.name}</Text>
            <LinearGradient
              colors={['#FFF0', '#FFF']} // TODO: Add theme variables support
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                ...StyleSheet.absoluteFillObject,
                width: 15,
                left: null,
              }}
            />
          </View>
        </Touchable>
      </ViewRN>
    );
  }
}
