import React, { PureComponent } from 'react';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { View, Button, Text, H2 } from 'native-base';

import { withStyleSheet } from 'theme';
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

const headerHeight = 330;
@withStyleSheet('Sparkle.UserHeading', {
  root: {
    alignItems: 'center',
    overflow: 'hidden',
    height: headerHeight,
  },

  avatar: {
    marginBottom: 25,
  },

  buttons: {
    flexDirection: 'row',
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

  button: {
    width: '30%',
    alignSelf: 'center',
    marginHorizontal: 5,
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
    user: fragmentProp(userFragment),
    loading: PropTypes.bool,
    onChatPress: PropTypes.func,
  }

  static defaultProps = {
    user: null,
    loading: false,
    onChatPress: () => {},
  };

  render() {
    const { style, styleSheet: styles, user, loading, onChatPress } = this.props;

    return (
      <View style={[styles.root, style]}>
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

        <View style={styles.buttons}>
          <Button block style={styles.button} onPress={onChatPress}>
            <Text>Chat</Text>
          </Button>

          <Button light bordered secondary block style={styles.button} onPress={() => {}}>
            <Text>Friends</Text>
          </Button>
        </View>
      </View>
    );
  }
}
