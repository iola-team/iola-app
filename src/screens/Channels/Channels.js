import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserChats, SearchBar, UsersRow, TouchableOpacity } from '~components';
import TabBarIcon from './TabBarIcon';
import { CHANNEL, CHAT_SEARCH } from '../routeNames';

@withStyleSheet('Sparkle.ChannelsScreen', {
  headerList: {
    paddingBottom: 15,

    /**
     * TODO: rethink
     * Prevent scroll bounce to show screen background
     */
    paddingTop: 999,
    marginTop: -999,
  },

  headerListContent: {
    paddingLeft: 10,
  },

  searchBar: {
    paddingTop: 0,
  },
})
/**
 * TODO: refactor the component to not use this `me` query just to read `me.id`
 */
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
  query MyOnlineFriendsQuery {
    me {
      id
      friends (filter: { online: true }) {
        edges {
          ...UsersRow_edge
        }
      }
    }
  }

  ${UsersRow.fragments.edge}
`)
export default class Channels extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon style={{ color: tintColor }} />
    ),
    headerStyle: {
      borderBottomWidth: 0,
    },
  });

  onChatPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { chatId: node.id });
  onUserPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { userId: node.id });
  onSearchPress = () => this.props.navigation.navigate(CHAT_SEARCH);
  onRefresh = () => this.props.data.refetch();

  componentDidMount() {
    const { navigation, data } = this.props;

    /**
     * TODO: Temporary solution, till we add online users `graphql` subscriptions
     * https://gitlab.com/thisissparkle/messenger/issues/337
     * 
     */
    navigation.addListener('didFocus', () => {
      data.refetch();
      data.startPolling(3000);
    });

    navigation.addListener('willBlur', () => data.stopPolling());
  }

  render() {
    const {
      styleSheet: styles,
      data: { me: { friends } = {}, loading: loadingFriends }, 
      meData: { me, loading: loadingMe }, 
      screenProps,
    } = this.props;

    return (
      <Container>
        <UserChats
          ListHeaderComponent={(
            <View foreground style={styles.headerList}>
              <TouchableOpacity onPressIn={this.onSearchPress}>
                <View style={styles.searchBar} padder pointerEvents="box-only">
                  <SearchBar placeholder="Search chats" />
                </View>
              </TouchableOpacity>


              <UsersRow
                loading={loadingFriends}
                edges={friends?.edges}
                onItemPress={this.onUserPress}
                contentContainerStyle={styles.headerListContent}

                noContentText="No friends online"
              />
            </View>
          )}

          loading={loadingMe}
          userId={me?.id}
          onItemPress={this.onChatPress}
          onRefresh={this.onRefresh}

          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
