import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container, View } from 'native-base';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from '~theme';
import { UserChats, SearchBar, TouchableOpacity } from '~components';
import TabBarIcon from './TabBarIcon';
import OnlineFriendsList from './OnlineFriendsList';
import { CHANNEL, CHAT_SEARCH } from '../routeNames';

@withStyleSheet('iola.ChannelsScreen', {
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
  options: {
    fetchPolicy: 'cache-first',
  },
})
@withNavigationFocus
export default class Channels extends Component {
  static navigationOptions = {
    title: 'Chats',
    tabBarIcon: props => <TabBarIcon {...props} />,
    headerStyle: {
      borderBottomWidth: 0,
    },
  };

  onChatPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { chatId: node.id });
  onUserPress = ({ node }) => this.props.navigation.navigate(CHANNEL, { userId: node.id });
  onSearchPress = () => this.props.navigation.navigate(CHAT_SEARCH);
  onRefresh = () => this.props.data.refetch();

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  renderHeader = () => {
    const { styleSheet: styles, navigation } = this.props;

    return (
      <View foreground style={styles.headerList}>
        <TouchableOpacity onPressIn={this.onSearchPress}>
          <View style={styles.searchBar} padder pointerEvents="box-only">
            <SearchBar placeholder="Search chats" />
          </View>
        </TouchableOpacity>

        <OnlineFriendsList
          navigation={navigation}
          contentContainerStyle={styles.headerListContent}
          onItemPress={this.onUserPress}
        />
      </View>
    );
  };

  render() {
    const {
      data: { me, loading },
      screenProps,
      isFocused,
    } = this.props;

    return (
      <Container>
        <UserChats
          shouldUpdate={isFocused}
          loading={loading}
          userId={me?.id}
          ListHeaderComponent={this.renderHeader}
          onItemPress={this.onChatPress}
          onRefresh={this.onRefresh}

          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
