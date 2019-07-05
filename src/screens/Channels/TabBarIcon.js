import React, { PureComponent } from 'react';
import { graphql, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import { sumBy } from 'lodash';

import { TabBarIcon as Icon } from '~components';

const subscriptionQuery = gql`
  subscription ChannelsMessageAddSubscription($userId: ID!) {
    onMessageAdd(userId: $userId) {
      chatEdge {
        node {
          id
          unreadMessages: messages(filter: {
            notReadBy: $userId
          }) {
            totalCount
          }
        }
      }
    }
  }
`;

const countsQuery = gql`
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
`;

@graphql(gql`
  query {
    me {
      id
    }
  }
`, {
  options: {
    fetchPolicy: 'cache-first',
  },
})
@graphql(countsQuery, {
  skip: ({ data: { me } }) => !me?.id,
  options: ({ data: { me } }) => ({
    variables: {
      userId: me.id,
    },
  }),
})
export default class TabBarIcon extends PureComponent {
  render() {
    const { data: { me }, ...props } = this.props;
    const count = sumBy(me?.chats.edges || [], 'node.messages.totalCount');
    
    return (
      <>
        <Icon {...props} count={count} name="chats-bar" />
        {me && <Subscription subscription={subscriptionQuery} variables={{ userId: me.id }} />}
      </>
    );
  }
}