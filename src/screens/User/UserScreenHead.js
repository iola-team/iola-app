import React, { Component } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { ScrollView } from 'react-native';
import { View, Spinner, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { UserHeading } from 'components';
import * as routes from '../roteNames';
import TabBar from './TabBar';
import PropTypes from "prop-types"

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
export default class UserScreenHead extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    renderTabBar: PropTypes.func.isRequired,
  }

  render() {
    const {
      style,
      styleSheet: styles,
      navigation: { goBack, navigate },
      user,
      renderTabBar,
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
            <Spinner/>
          )
        }

        {renderTabBar()}
      </View>
    );
  }
}
