import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { TouchableWithoutFeedback } from 'react-native';
import { Container, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { ChatList, Icon, SearchBar, UsersRow } from '~components';
import { CHANNEL } from '../routeNames';

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
    }

    users(filter: { online: true }, first: 100) {
      edges {
        ...UsersRow_edge
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

  /**
   * TODO: implement chats search
   */
  onStartPress = () => {};

  render() {
    const { styleSheet: styles, data: { me, users, loading } } = this.props;

    return (
      <Container>
        <ChatList
          ListHeaderComponent={(
            <View highlight style={styles.headerList}>
              <TouchableWithoutFeedback onPressIn={this.onStartPress}>
                <View padder pointerEvents="box-only">
                  <SearchBar placeholder="Search chats" />
                </View>
              </TouchableWithoutFeedback>


              <UsersRow
                loading={loading}
                edges={users?.edges || []}
                onItemPress={this.onUserPress}
              />
            </View>
          )}
          userId={me?.id}
          onItemPress={this.onChatPress}
        />
      </Container>
    );
  }
}
