import React, { Component } from 'react';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { Thumbnail } from 'native-base';

import { withStyle } from 'theme';
import TouchableOpacity from '../TouchableOpacity';
import Placeholder from '../Placeholder';

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
  }
`;

@withStyle('Sparkle.UserAvatar', {
  'Sparkle.Placeholder': {
    backgroundColor: '#F8F9FB',
    borderRadius: 8,

    'NativeBase.Thumbnail': {
      opacity: 0,
    },
  },
})
export default class UserAvatar extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    user: null,
    size: 'small',
    onPress: noop,
    loading: false,
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { style, user, loading, size, onPress, ...props } = this.props;
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

    const uri = get(user, ['avatar', size], defaultUri);
    const thumbnail = (
      <Thumbnail {...thumbnailProps} style={style} source={{ uri }} />
    );

    return onPress ? (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {thumbnail}
      </TouchableOpacity>
    ) : thumbnail;
  }
}
