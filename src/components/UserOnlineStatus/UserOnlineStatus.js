import React, { PureComponent } from 'react';
import { View } from 'native-base';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';

import { withStyle } from '~theme';
import OnlineStatus from './OnlineStatus';

const userFragment = gql`
  fragment UserOnlineStatus_user on User {
    isOnline
  }
`;

@withStyle('iola.UserOnlineStatus')
export default class UserOnlineStatus extends PureComponent {
  static propTypes = {
    user: fragmentProp(userFragment),
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, style } = this.props;

    return user && (
      <View style={style}>
        <OnlineStatus online={user.isOnline} />
      </View>
    );
  }
}
