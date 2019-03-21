import React, { Component } from 'react';
import { View, Text } from 'react-native';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet } from '~theme';
import Placeholder from '../Placeholder';
import UserAvatar from '../UserAvatar';
import UserOnlineStatus from '../UserOnlineStatus';
import ImageFit from '../ImageFit';

const imageCommentsItemFragment = gql`
  fragment ImageCommentsItemFragment on Comment {
    id
    text
    image
    createdAt
    user {
      id
      name
      ...UserOnlineStatus_user
      ...UserAvatar_user
    }
  }

  ${UserOnlineStatus.fragments.user}
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
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    marginRight: 8,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#45474F',
  },

  text: {
    paddingVertical: 6,
    fontSize: 14,
    lineHeight: 17,
    color: '#45474F',
  },

  image: {
    marginTop: 6,
    marginBottom: 13,
  },

  createdAt: {
    fontSize: 14,
    lineHeight: 16,
    color: '#BDC0CB',
  },

  placeholderContainer: {
    flex: 1,
    height: 88, // @TODO: "magic number issue" - imageComment height
  },

  placeholderContent: {
    backgroundColor: '#E4E8EF',
    elevation: 0,
  },

  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E4E8EF',
  },
})
export default class ImageCommentsItem extends Component {
  static propTypes = {
    comment: fragmentProp(imageCommentsItemFragment),
  };

  static defaultProps = {
    comment: null,
  };

  static fragments = {
    comment: imageCommentsItemFragment,
  };

  renderPlaceholder() {
    const { styleSheet: styles } = this.props;

    return (
      <Placeholder style={[styles.container, styles.placeholderContainer]}>
        <View style={[styles.avatar, styles.placeholderAvatar]} />
        <View style={[styles.content, styles.placeholderContent]}>
          <View style={styles.nameRow}>
            <Text style={styles.name} />
          </View>
          <Text style={styles.text} />
          <Text style={styles.createdAt} />
        </View>
      </Placeholder>
    );
  }

  render() {
    if (!this.props.comment) return this.renderPlaceholder();

    const { styleSheet: styles, comment: { id, text, image, createdAt, user } } = this.props;
    const date = moment.duration(moment(createdAt).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;

    return (
      <View style={styles.container} key={id}>
        <UserAvatar user={user} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <UserOnlineStatus user={user} />
          </View>
          {!!text && <Text style={styles.text}>{text}</Text>}
          {image && <ImageFit style={styles.image} url={image} maxHeight={192} maxWidth={192} />}
          <Text style={styles.createdAt}>{dateFormatted}</Text>
        </View>
      </View>
    );
  }
}
