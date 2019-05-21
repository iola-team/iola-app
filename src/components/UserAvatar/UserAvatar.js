import React, { Component } from 'react';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { View as ViewRN } from 'react-native';
import { Thumbnail, View } from 'native-base';

import { withStyle } from '~theme';
import TouchableOpacity from '../TouchableOpacity';
import Placeholder from '../Placeholder';
import UserOnlineStatus from '../UserOnlineStatus';

const userFragment = gql`
  fragment UserAvatar_user on User {
    id
    avatar {
      id
      url
      small: url
      medium: url(size: MEDIUM)
      large: url(size: MEDIUM)
    }
    ...UserOnlineStatus_user
  }
  
  ${UserOnlineStatus.fragments.user}
`;

const thumbnailStyle = {
  'NativeBase.ViewNB': {
    'NativeBase.ViewNB': {
      position: 'absolute',
      right: -5,
      bottom: -5,
      padding: 2,
      borderRadius: 5,
    },

    '.large': {
      'NativeBase.ViewNB': {
        right: -11,
        bottom: -11,
        padding: 4,
        borderRadius: 10,

        'Sparkle.UserOnlineStatus': {
          'NativeBase.ViewNB': {
            'Sparkle.OnlineStatus': {
              'NativeBase.ViewNB': {
                width: 15,
                height: 15,
                borderRadius: 7,
              },
            },
          },
        },
      },
    },
  },
};

@withStyle('Sparkle.UserAvatar', {
  'Sparkle.Placeholder': {
    borderRadius: 8,

    'NativeBase.Thumbnail': {
      opacity: 0,
    },
  },

  'Sparkle.TouchableOpacity': {
    ...thumbnailStyle,
  },

  ...thumbnailStyle,
})
export default class UserAvatar extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
    loading: PropTypes.bool,
    foreground: PropTypes.bool,
  };

  static defaultProps = {
    user: null,
    size: 'medium',
    onPress: null,
    loading: false,
    foreground: false,
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { style, user, loading, size, onPress, foreground, ...props } = this.props;
    const sizeProps = {
      small: size === 'small',
      large: size === 'large',
    };

    const thumbnailProps = { ...props, ...sizeProps };
    const defaultUri = 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg';

    if (loading) {
      return (
        <ViewRN style={style}>
          <Placeholder {...sizeProps}>
            <Thumbnail {...thumbnailProps} source={{ uri: defaultUri }} />
          </Placeholder>
        </ViewRN>
      );
    }

    const borderSizeProps = {
      small: size === 'small',
      medium: size === 'medium',
      large: size === 'large',
    };
    const uri = get(user, ['avatar', size], defaultUri);
    const thumbnail = (
      <ViewRN style={style}>
        <View {...borderSizeProps}>
          <Thumbnail {...thumbnailProps} source={{ uri }} />
          <View foreground={foreground} highlight={!foreground}>
            <UserOnlineStatus user={user} />
          </View>
        </View>
      </ViewRN>
    );

    return onPress ? (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {thumbnail}
      </TouchableOpacity>
    ) : thumbnail;
  }
}
