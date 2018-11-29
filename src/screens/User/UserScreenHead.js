import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import { View, Spinner } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { UserHeading } from 'components';
import * as routes from '../roteNames';

const userFragment = gql`
  fragment UserScreenHead_user on User {
    id
    ...UserHeading_user
  }

  ${UserHeading.fragments.user}
`;

@styleSheet('Sparkle.UserScreenHead', {
  head: {
    marginTop: 55,
    marginBottom: 40,
  },
})
export default class UserScreenHead extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
  }

  render() {
    const {
      style,
      styleSheet: styles,
      navigation: { goBack, navigate },
      user,
    } = this.props;

    return (
      <View style={style} highlight>
        {
          user ? (
            <UserHeading
              style={styles.head}
              user={user}
              onBackPress={() => goBack()}
              onChatPress={() => navigate(routes.CHANNEL, { userId: user.id })}
            />
          ) : (
            <Spinner />
          )
        }
      </View>
    );
  }
}
