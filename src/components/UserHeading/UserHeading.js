import React, { PureComponent } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { View, Text, H2 } from 'native-base';
import { Animated, StyleSheet } from 'react-native';

import { withStyleSheet } from 'theme';
import ScreenHeader from '../ScreenHeader';
import UserAvatar from '../UserAvatar';
import Placeholder from '../Placeholder';

const userFragment = gql`
  fragment UserHeading_user on User {
    id
    name
    info {
      headline
    }
    
    ...UserAvatar_user
  }
  
  ${UserAvatar.fragments.user}
`;

const headerHeight = 350 + ScreenHeader.HEIGHT;

@withStyleSheet('Sparkle.UserHeading', {
  root: {
    alignItems: 'center',
    overflow: 'hidden',
    height: headerHeight,
    paddingTop: ScreenHeader.HEIGHT,
  },

  avatar: {
    marginBottom: 25,
  },

  info: {
    marginBottom: 20,
  },

  infoLine: {
    alignItems: 'center',
    marginBottom: 5,
  },

  headline: {
    color: '#BDC0CB',
  },

  placeholder: {
    borderRadius: 4,
    backgroundColor: '#F0F2F7',
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
    height: ScreenHeader.HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  navBarBgText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },

  'NativeBase.ViewNB': {
    'Sparkle.UserAvatar': {
      'Sparkle.Placeholder': {
        backgroundColor: '#F0F2F7',
      },
    },
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
  }

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
      <View style={[styles.root, style]} {...props}>
        <UserAvatar style={styles.avatar} loading={loading} user={user} size="large" />

        <View style={styles.info}>
          <View style={styles.infoLine}>
            <Placeholder isActive={loading}>
              <H2 style={loading ? [styles.placeholder, styles.namePlaceholder] : null}>
                {loading ? ' ' : user.name}
              </H2>
            </Placeholder>
          </View>

          <View style={styles.infoLine}>
            <Placeholder isActive={loading}>
              <Text
                note
                style={loading ? [styles.placeholder, styles.headlinePlaceholder] : styles.headline}
              >
                {loading ? ' ' : user.info.headline}
              </Text>
            </Placeholder>
          </View>
        </View>

        <View style={styles.content}>
          {children}
        </View>

        <Animated.View style={[styles.navBarBg, navBarStyle]}>
          <Text style={styles.navBarBgText}>{!loading && user.name}</Text>
        </Animated.View>
      </View>
    );
  }
}
