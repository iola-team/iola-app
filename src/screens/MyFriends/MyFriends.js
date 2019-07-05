import React, { Component } from 'react';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import { USER } from '../routeNames';
import MyFriendsConnection from './MyFriendsConnection';
import TabBarLabel from './TabBarLabel';

@withStyleSheet('Sparkle.MyFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
export default class MyFriends extends Component {
  static navigationOptions = {
    tabBarLabel: () => <TabBarLabel />,
  };

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate({ routeName: USER, params: { id }, key: id });
  };

  render() {
    const { styleSheet: styles, screenProps } = this.props;

    return (
      <Container>
        <MyFriendsConnection
          contentContainerStyle={styles.list}
          onItemPress={this.onItemPress}

          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
