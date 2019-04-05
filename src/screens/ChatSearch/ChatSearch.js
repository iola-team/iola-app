import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';
import { Container, Text } from 'native-base';

import { withStyleSheet } from '~theme';
import { CHANNEL } from '../routeNames';
import {
  SearchBar,
  SearchResult,
  ChatList,
  UsersRow,
  SearchBlank,
  TouchableOpacity,
} from '~components';

const meQuery = gql`
  query UserChatsSearchMeQuery {
    me {
      id

      ...ChatList_user
    }
  }

  ${ChatList.fragments.user}
`;

const searchQuery = gql`
  query UserChatsSearchQuery {
    me {
      id
      chats {
        edges {
          node {
            id
            participants {
              id
              name
            }
          }

          ...ChatList_edge
        }

        ...SearchResult_connection
      }
    }
  }

  ${SearchResult.fragments.connection}
  ${ChatList.fragments.edge}
`;

const onlineUsersQuery = gql`
  query UserSearchOnlineQuery {
    users(filter: { online: true }, first: 100) {
      edges {
        ...UsersRow_edge
      }
    }
  }

  ${UsersRow.fragments.edge}
`;

const recentChatsQuery = gql`
  query ChatSearchRecentQuery {
    me {
      chats {
        edges {
          ...ChatList_edge
        }
      }
    }
  }

  ${ChatList.fragments.edge}
`;

@withStyleSheet('Sparkle.ChatSearchScreen', {
  'NativeBase.Container': {
    backgroundColor: '#FFFFFF',
  },
})
@graphql(meQuery)
export default class ChatSearch extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        autoFocus
        placeholder="Search chats"
        searching={navigation.getParam('searching', false)}
        value={navigation.getParam('search', '')}
        onChangeText={search => navigation.setParams({ search })}
      />
    ),
    headerTitleContainerStyle: {
      left: 16, // TODO: Move this value to theme somehow
    },
    headerLeft: null,
    headerRight: (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Close</Text>
      </TouchableOpacity>
    ),
  });

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate(CHANNEL, { userId: id });
  };

  renderList = (props) => {
    const { data: { me } } = this.props;

    return (
      <ChatList
        {...props}

        user={me}
        ListEmptyComponent={null} // Disable `no items`

        initialNumToRender={6}
      />
    );
  };

  renderBlank = ({ onItemPress, recentIds }) => {
    const { data: { me } } = this.props;
    const recentEdgeFilter = ({ node }) => recentIds.includes(node.id);
    const recentEdgeSorter = (a, b) => recentIds.indexOf(a.node.id) - recentIds.indexOf(b.node.id);

    return (
      <Query query={onlineUsersQuery}>
        {({ data: { users: onlineUsers }, loading: loadingOnline }) => (
          <Query query={recentChatsQuery} variables={{ ids: recentIds }} skip={!recentIds.length}>
            {({ data: recentData, loading: loadingRecent }) => (

              <SearchBlank
                /**
                 * TODO: Memo the sort result
                 */
                edges={(
                  recentData?.me?.chats.edges.filter(recentEdgeFilter).sort(recentEdgeSorter) || []
                )}

                user={me}
                loading={loadingRecent}
                hasRecentItems={!!recentIds.length}
                headerTitle="Online"
                contentTitle="Recent"
                onItemPress={onItemPress}
                ListEmptyComponent={null} // Disable `no items`
                ListComponent={ChatList}
                headerList={(
                  <UsersRow
                    loading={loadingOnline}
                    edges={onlineUsers?.edges || []}
                    onItemPress={onItemPress}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              />

            )}
          </Query>
        )}
      </Query>
    );
  };

  filterEdges = (edge, rawSearch) => {
    const { data: { me } } = this.props;
    const { node: { participants } } = edge;
    const search = rawSearch.toLowerCase();

    const recipients = participants.filter(({ id }) => me.id !== id);
    const inRecipients = !!recipients.filter(({ name }) => (
      name.toLowerCase().indexOf(search) === 0
    )).length;

    return inRecipients;
  };

  onSearchingStateChange = (searching) => {
    const { navigation } = this.props;

    navigation.setParams({ searching });
  };

  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <SearchResult
          search={navigation.getParam('search', '')}
          query={searchQuery}
          historyKey="chats"
          connectionPath="me.chats"
          onItemPress={this.onItemPress}
          filterEdges={this.filterEdges}
          renderBlank={this.renderBlank}
          onSearchingStateChange={this.onSearchingStateChange}
        >
          {this.renderList}
        </SearchResult>
      </Container>
    );
  }
}