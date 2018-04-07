import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { TouchableOpacity } from 'react-native';
import {
  Thumbnail,
} from 'native-base';

const userFragment = gql`    
  fragment UserAvatar_user on User {
    id
    avatar {
      id
      url
    }
  }
`;

export default class UserAvatar extends Component {
  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
    onPress: PropTypes.func,
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, onPress, ...restProps } = this.props;

    const props = {
      ...restProps,
    };

    if (user) {
      const uri = user.avatar
        ? user.avatar.url
        : 'http://www.puristaudiodesign.com/Data/images/misc/default-avatar.jpg'; // TODO use correct default image

      props.source = { uri };
    }

    const thumbnail = (
      <Thumbnail {...props} />
    );

    return onPress ? (
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        {thumbnail}
      </TouchableOpacity>
    ) : thumbnail;
  }
}
