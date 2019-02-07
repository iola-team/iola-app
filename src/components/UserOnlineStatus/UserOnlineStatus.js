import React, { Component } from 'react';
import { View } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyle } from 'theme';

const userFragment = gql`
  fragment UserOnlineStatus_user on User {
    activityTime
  }
`;

@withStyle('Sparkle.UserOnlineStatus', {
  width: 8,
  height: 8,
  borderRadius: 4,
})
export default class UserOnlineStatus extends Component {
  static propTypes = {
    user: fragmentProp(userFragment),
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, style } = this.props;
    const isOnline = activityTime => moment().diff(activityTime, 'minutes') <= 5;

    return user ? (
      <View
        style={[
          style,
          { backgroundColor: isOnline(user.activityTime) ? '#3BC486' : '#BDC0CB' },
        ]}
      />
    ) : null;
  }
}
