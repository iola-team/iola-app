import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { shouldUpdate } from 'recompose';
import { filter, noop, memoize } from 'lodash';

import ChatList from '../ChatList';
import MessageUpdateSubscription from '../MessageUpdateSubscription';

const chatsQuery = gql`
  query UserChatsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...on User {
        chats {
          edges {
            node {
              id
              unreadMessages: messages(filter: {
                notReadBy: $userId
              }) {
                totalCount
              }
            }

            ...ChatList_edge
          }
        }
      }

      ...ChatList_user
    }
  }

  ${ChatList.fragments.user}
  ${ChatList.fragments.edge}
`;

const subscriptionQuery = gql`
  subscription UserChatsMessageAddSubscription($userId: ID!) {
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

        ...ChatList_edge
      }
    }
  }

  ${ChatList.fragments.edge}
`;

@graphql(chatsQuery, {
  options: ({ userId }) => ({
    variables: {
      userId,
    },
  }),
  skip: props => !props.userId,
})
@shouldUpdate((props, nextProps) => nextProps.shouldUpdate)
export default class UserChats extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    loading: PropTypes.bool,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
  };

  static defaultProps = {
    userId: null,
    loading: false,
    onRefresh: noop,
    refreshing: false,
  };

  state = {
    isRefreshing: false,
  };

  unsubscribe = () => null;

  startSubscriptions() {
    const { data, userId } = this.props;

    if (!data) {
      return;
    }

    this.unsubscribe();
    this.unsubscribe = data.subscribeToMore({
      document: subscriptionQuery,
      variables: { userId },
      updateQuery(prev, { subscriptionData }) {
        if (!subscriptionData.data) {
          return prev;
        }

        const { chatEdge } = subscriptionData.data.onMessageAdd;
        return update(prev, {
          user: {
            chats: {
              edges: {
                $set: [
                  chatEdge,
                  ...filter(prev.user.chats.edges, ({ node }) => node.id !== chatEdge.node.id),
                ],
              },
            },
          },
        });
      },
    });
  }

  refresh = async () => {
    const { data: { refetch }, onRefresh } = this.props;
    
    this.setState({ isRefreshing: true });
    try {
      await refetch({ cursor: null });
    } catch {
      // Pass...
    }

    await onRefresh();
    this.setState({ isRefreshing: false });
  };

  componentDidUpdate(prevProps) {
    const { userId } = this.props;

    if (prevProps.userId !== userId) {
      this.startSubscriptions();
    }
  }

  componentDidMount() {
    this.startSubscriptions();
  }

  getUnreadCounts = memoize(
    edges => edges?.map(edge => edge.node.unreadMessages.totalCount) || [],
  );

  render() {
    const { data, loading, ...props } = this.props;
    const { isRefreshing } = this.state;
    const edges = data?.user?.chats.edges;
    const unreadCounts = this.getUnreadCounts(edges);

    return (
      <>
        <ChatList
          {...props}

          refreshing={isRefreshing || props.refreshing}
          loading={loading || data?.loading}
          user={data?.user}
          unreadCounts={unreadCounts}
          edges={edges}

          onRefresh={this.refresh}
        />

        {data?.user && <MessageUpdateSubscription userId={data.user.id} />}
      </>
    );
  }
}
