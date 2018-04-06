import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { ScreenHeader, UserAvatar } from 'components';

@graphql(gql`
  query ChannelWithUserQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        name
      }
      ...UserAvatar_user
    }
  }

  ${UserAvatar.fragments.user}
`, {
  options: ({ userId }) => ({
    variables: {
      userId
    },
  }),
})
@styleSheet('Sparkle.ChannelScreenHeader')
export default class ChannelHeader extends Component {

  renderRight() {
    const { data: { user }, styleSheet } = this.props;

    return user && (
      <UserAvatar user={user} style={styleSheet.avatar} />
    );
  }

  render() {
    const { data: { user } } = this.props;
    const title = user.name || '';

    return (
      <ScreenHeader {...this.props} title={title} renderRight={::this.renderRight} />
    );
  }
}
