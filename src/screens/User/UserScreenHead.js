import React, { PureComponent, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { View, Text } from 'native-base';
import { Animated, StyleSheet } from 'react-native';

import { withStyleSheet } from 'theme';
import { UserHeading, ScreenHeader } from 'components';
import * as routes from '../roteNames';

const AnimatedView = Animated.createAnimatedComponent(View);
const userQuery = gql`
  query UserDetailsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        name
      }
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

@withStyleSheet('Sparkle.UserScreenHead', {
  head: {
    marginTop: ScreenHeader.HEIGHT,
    marginBottom: 30,
  },

  navBar: {
    ...StyleSheet.absoluteFillObject,
    bottom: null,
    height: ScreenHeader.HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  navBarText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },
})
export default class UserScreenHead extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT + ScreenHeader.HEIGHT + 30;

  render() {
    const {
      style,
      styleSheet: styles,
      navigation: { goBack, navigate, state },
      shrinkAnimatedValue,
      shrinkAnimationHeight,
      ...props
    } = this.props;

    const navBarStyle = {
      opacity: shrinkAnimatedValue.interpolate({
        inputRange: [0, 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: shrinkAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [shrinkAnimationHeight, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    return (
      <View style={style} highlight>
        <Query query={userQuery} variables={{ userId: state.params.id }}>
          {({ data: { user }, loading }) => (
            <Fragment>
              <AnimatedView style={styles.head}>
                <UserHeading
                  {...props}
                  loading={loading}
                  user={user}
                  onBackPress={() => goBack()}
                  onChatPress={() => navigate(routes.CHANNEL, { userId: state.params.id })}
                />
              </AnimatedView>

              <AnimatedView style={[styles.navBar, navBarStyle]}>
                <Text style={styles.navBarText}>{user && user.name}</Text>
              </AnimatedView>
            </Fragment>
          )}
        </Query>
      </View>
    );
  }
}
