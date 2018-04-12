import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  Text,
  View,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import UserAvatar from '../UserAvatar'

const userFragment = gql`
  fragment AvatarToolbar_user on User {
    id
    
    ...UserAvatar_user
  }
  
  ${UserAvatar.fragments.user}
`;

@styleSheet('Sparkle.AvatarToolbar', {
  root: {
    flexDirection: 'row',
  }
})
export default class AvatarToolbar extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment)
  };

  render() {
    const { styleSheet, style, user } = this.props;

    return (
      <View style={[styleSheet.root, style]}>
        <UserAvatar large user={user} />
        <View horizontalPadder>
          <Text note>
            Edit profile photo</Text>
        </View>
      </View>
    );
  }
}
