import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { sumBy } from 'lodash';

import { TabBarIcon as Icon } from '~components';

@graphql(gql`
  query {
    me {
      id
    }
  }
`, {
  name: 'meData',
  options: {
    fetchPolicy: 'cache-first',
  },
})
@graphql(gql`
  query ChannelsCountQuery($userId: ID!) {
    me {
      id
      chats {
        edges {
          node {
            id
            messages(filter: {
              notReadBy: $userId
            }) {
              totalCount
            }
          }
        }
      }
    }
  }
`, {
  skip: ({ meData: { me } }) => !me?.id,
  options: ({ meData: { me } }) => ({
    variables: {
      userId: me.id,
    },
  }),
})
export default class TabBarIcon extends Component {
  render() {
    const { data: { me }, ...props } = this.props;
    const count = sumBy(me?.chats.edges || [], 'node.messages.totalCount');
    
    return <Icon {...props} count={count} name="chats-bar" />;
  }
}