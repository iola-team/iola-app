import React, { Component } from 'react';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { Thumbnail, View } from 'native-base';

import { withStyle, theme } from '~theme';
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

@withStyle('Sparkle.UserAvatar', {
  'Sparkle.Placeholder': {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,

    'NativeBase.Thumbnail': {
      opacity: 0,
    },
  },

  'NativeBase.ViewNB': {
    position: 'relative',

    'NativeBase.ViewNB': {
      position: 'absolute',
      borderWidth: 2,
      borderRadius: 5,
    },

    '.small': {
      'NativeBase.ViewNB': {
        top: (32 - 7),
        left: (32 - 7),
      }
    },

    '.medium': {
      'NativeBase.ViewNB': {
        top: (40 - 7),
        left: (40 - 7),
      }
    },

    '.large': {
      'NativeBase.ViewNB': {
        top: (168 - 12),
        left: (168 - 12),
        borderWidth: 4,
        borderRadius: 10,

        'Sparkle.UserOnlineStatus': {
          'NativeBase.ViewNB': {
            'Sparkle.OnlineStatus': {
              'NativeBase.ViewNB': {
                width: 15,
                height: 15,
                borderRadius: 7,
              }
            }
          }
        }
      }
    },
  },
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
        <Placeholder style={style} {...sizeProps}>
          <Thumbnail {...thumbnailProps} source={{ uri: defaultUri }} />
        </Placeholder>
      );
    }

    const borderSizeProps = {
      small: size === 'small',
      medium: size === 'medium',
      large: size === 'large',
    };
    const borderStyle = {
      borderColor: foreground ? theme.foregroundColor : theme.highlightColor,
      backgroundColor: foreground ? theme.foregroundColor : theme.highlightColor,
    };
    const uri = get(user, ['avatar', size], defaultUri);
    const thumbnail = (
      <View {...borderSizeProps}>
        <Thumbnail {...thumbnailProps} style={style} source={{ uri }} />
        <View style={borderStyle}>
          <UserOnlineStatus user={user} />
        </View>
      </View>
    );

    return onPress ? (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {thumbnail}
      </TouchableOpacity>
    ) : thumbnail;
  }
}
