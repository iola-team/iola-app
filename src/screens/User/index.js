import React, { Component } from 'react';
import { Animated, Dimensions, ScrollView } from 'react-native';
import { Text, View, Container, Content } from 'native-base';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { debounce } from 'lodash';

export UserInfoTab from './UserInfoTab';
export UserFriendsTab from './UserFriendsTab';
export UserPhotosTab from './UserPhotosTab';

import UserScreenHead from './UserScreenHead';

export default (routes, config = {}) => {
  const Tabs = createMaterialTopTabNavigator(routes, {
    tabBarComponent: props => null,
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
  });

  return class UserNavigator extends Component {
    static router = Tabs.router;
    static navigationOptions = {
      headerTransparent: true,
    };

    state = {
      contentOffset: {
        x: 0,
        y: 0,
      },
    };

    updateOffset = debounce(contentOffset => this.setState({ contentOffset }), 100);

    render() {
      const { navigation } = this.props;
      const header = (
        <UserScreenHead navigation={navigation} />
      );

      const screenProps = {
        header,
        contentOffset: this.state.contentOffset,
        onScroll: (event) => {
          this.updateOffset(event.nativeEvent.contentOffset);
        },
      };

      return (
        <Container>
          <Tabs navigation={navigation} screenProps={screenProps} />
        </Container>
      );
    }
  };
}
