import React, { PureComponent } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Text, H2 } from 'native-base';
import { Animated, StyleSheet } from 'react-native';

import { withStyleSheet } from '~theme';
import ScreenHeader from '../ScreenHeader';
import UserAvatar from '../UserAvatar';
import UserOnlineStatus from '../UserOnlineStatus';
import Placeholder from '../Placeholder';

const userFragment = gql`
  fragment UserHeading_user on User {
    id
    name
    ...UserOnlineStatus_user
    ...UserAvatar_user

    info {
      headline
    }
  }
  
  ${UserOnlineStatus.fragments.user}
  ${UserAvatar.fragments.user}
`;

const headerHeight = 350 + 10;

@withStyleSheet('Sparkle.UserHeading', {
  root: {
    alignItems: 'center',
    overflow: 'hidden',
    height: headerHeight,
    paddingTop: 10,
  },

  avatar: {
    marginBottom: 25,
  },

  info: {
    marginBottom: 20,
  },

  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  headline: {},

  placeholder: {
    borderRadius: 4,
  },

  onlineStatus: {
    marginLeft: 8,
  },

  namePlaceholder: {
    width: 200,
  },

  headlinePlaceholder: {
    width: 150,
  },

  content: {

  },

  navBarBg: {
    ...StyleSheet.absoluteFillObject,
    bottom: null,
    top: getStatusBarHeight(),
    height: ScreenHeader.HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navBarBgText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },
})
export default class UserHeading extends PureComponent {
  static HEIGHT = headerHeight;
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    shrinkAnimationHeight: PropTypes.number.isRequired,
    shrinkAnimatedValue: PropTypes.object.isRequired,

    user: fragmentProp(userFragment),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    user: null,
    loading: false,
  };

  render() {
    const {
      style,
      styleSheet: styles,
      user,
      loading,
      children,
      shrinkAnimatedValue,
      shrinkAnimationHeight,
      ...props
    } = this.props;

    const navBarStyle = {
      opacity: shrinkAnimatedValue.interpolate({
        inputRange: [0, 0.01, 0.1],
        outputRange: [1, 1, 0],
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

    const contentStyle = {
      opacity: shrinkAnimatedValue.interpolate({
        inputRange: [0, 0.1, 0.25],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    };

    const showLoading = loading && !user;

    return (
      <View style={[styles.root, style]} {...props}>
        <UserAvatar
          style={styles.avatar}
          loading={showLoading}
          user={user}
          size="large"
          priority="high"
          foreground
        />

        <View style={styles.info}>
          <View style={styles.infoLine}>
            <Placeholder
              isActive={showLoading}
              style={showLoading ? [styles.placeholder, styles.namePlaceholder] : null}
            >
              <H2>
                {showLoading ? ' ' : user.name}
              </H2>
            </Placeholder>
          </View>

          <View style={styles.infoLine}>
            <Placeholder
              isActive={showLoading}
              style={showLoading ? [styles.placeholder, styles.headlinePlaceholder] : null}
            >
              <Text
                secondary
                style={styles.headline}
              >
                {showLoading ? ' ' : user.info.headline}
              </Text>
            </Placeholder>
          </View>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          {children}
        </Animated.View>

        <Animated.View style={[styles.navBarBg, navBarStyle]}>
          <Animated.Text style={styles.navBarBgText}>{!showLoading && user.name}</Animated.Text>
        </Animated.View>
      </View>
    );
  }
}
