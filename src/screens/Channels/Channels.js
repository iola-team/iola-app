import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserChats, Icon, SearchBar, UsersRow, TouchableOpacity } from '~components';
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
})
@graphql(gql`
  query ChannelsQuery {
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
      <Icon name="chats-bar" style={{ color: tintColor, fontSize: 20 }} />
    ),
    headerStyle: {
      borderBottomWidth: 0,
    },
  });

  onChatPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { chatId: node.id });
  onUserPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { userId: node.id });
  onSearchPress = () => this.props.navigation.navigate(CHAT_SEARCH);

  render() {
    const { styleSheet: styles, data: { me, loading }, screenProps } = this.props;

    return (
      <Container>
        <UserChats
          ListHeaderComponent={(
            <View foreground style={styles.headerList}>
              <TouchableOpacity onPressIn={this.onSearchPress}>
                <View padder pointerEvents="box-only">
                  <SearchBar placeholder="Search chats" />
                </View>
              </TouchableOpacity>


              <UsersRow
                loading={loading}
                edges={me?.friends.edges}
                onItemPress={this.onUserPress}

                noContentText="No friends online"
              />
            </View>
          )}
          userId={me?.id}
          onItemPress={this.onChatPress}

          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
