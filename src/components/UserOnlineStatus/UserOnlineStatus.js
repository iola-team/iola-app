import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
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
  },
})
export default class UserOnlineStatus extends Component {
  static propTypes = {
    user: fragmentProp(userFragment),
    style: PropTypes.object,
  };

  static fragments = {
    user: userFragment,
  };

  render() {
    const { styleSheet: styles, user, style } = this.props;
    const isOnline = activityTime => moment().diff(activityTime, 'minutes') <= 5;

    return user ? (
      <View
        style={[
          style,
          styles.status,
          { backgroundColor: isOnline(user.activityTime) ? '#3BC486' : '#BDC0CB' },
        ]}
      />
    ) : null;
  }
}
