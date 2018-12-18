import React, { Component } from 'react';
import { View, Text } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet } from 'theme';
import UserOnlineStatus from '../UserOnlineStatus';
import UserAvatar from '../UserAvatar';

const imageCommentsItemFragment = gql`
  fragment ImageCommentsItemFragment on Comment {
    id
    text
    createdAt
    user {
      id
      name
      ...UserAvatar_user
    }
  }

  ${UserAvatar.fragments.user}
`;

@styleSheet('Sparkle.ImageCommentsItem', {
  container: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  avatar: {
    marginRight: 8,
  },

  content: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // @TODO: box-shadow
    shadowColor: '#E1E6ED',
    shadowRadius: 4,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    marginRight: 8,
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#45474F',
  },

  text: {
    paddingVertical: 6,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#45474F',
  },

  createdAt: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 16,
    color: '#BDC0CB',
  },
})
export default class ImageCommentsItem extends Component {
  static propTypes = {
    comment: fragmentProp(imageCommentsItemFragment).isRequired,
  };

  static fragments = {
    comment: imageCommentsItemFragment,
  };

  render() {
    const { styleSheet: styles, comment: { id, text, createdAt, user } } = this.props;
    const date = moment.duration(moment(createdAt).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;
    const isOnline = true; // @TODO

    return (
      <View style={styles.container} key={id}>
        <UserAvatar user={user} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <UserOnlineStatus isOnline={isOnline} />
          </View>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.createdAt}>{dateFormatted}</Text>
        </View>
      </View>
    );
  }
}
