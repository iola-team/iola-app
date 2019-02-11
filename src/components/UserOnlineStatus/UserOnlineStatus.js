import React, { Component } from 'react';
import { View } from 'native-base';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet } from 'theme';

const userFragment = gql`
  fragment UserOnlineStatus_user on User {
    activityTime
  }
`;


@styleSheet('Sparkle.UserOnlineStatus', {
  status: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDC0CB',
  },

  online: {
    backgroundColor: '#3BC486',
  },
})
export default class UserOnlineStatus extends Component {
  static propTypes = {
    user: fragmentProp(userFragment),
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { user, styleSheet: styles } = this.props;
    const isOnline = activityTime => moment().diff(activityTime, 'minutes') <= 5;

    return user && <View style={[styles.status, isOnline(user.activityTime) && styles.online]} />;
  }
}
