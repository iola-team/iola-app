import React, { Component } from 'react';
import { get, noop } from 'lodash';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { TouchableOpacity } from 'react-native';
import {
  Thumbnail,
} from 'native-base';

import { withStyle } from 'theme';

const userFragment = gql`    
  fragment UserAvatar_user on User {
    id
    avatar {
      id
      small: url
      medium: url(size: MEDIUM)
      large: url(size: MEDIUM)
    }
  }
`;

export default class UserAvatar extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    user: fragmentProp(userFragment).isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    size: 'small',
    onPress: noop,
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, size, onPress, ...props } = this.props;
    const thumbnailProps = {
      ...props,
      small: size === 'small',
      large: size === 'large'
    };

    if (user) {
      const uri = user.avatar
        ? user.avatar[size]
        : 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg'; // TODO use correct default image

      thumbnailProps.source = { uri };
    }

    const thumbnail = (
      <Thumbnail {...thumbnailProps} />
    );

    return onPress ? (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {thumbnail}
      </TouchableOpacity>
    ) : thumbnail;
  }
}
