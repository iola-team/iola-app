import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { createMaterialTopTabNavigator, createNavigator } from 'react-navigation';
import { debounce } from 'lodash';
import { Animated, Dimensions, ScrollView } from 'react-native';
import { Text, View, Container, Content } from 'native-base';

export UserInfoTab from './UserInfoTab';
export UserFriendsTab from './UserFriendsTab';
export UserPhotosTab from './UserPhotosTab';

import UserScreenHead from './UserScreenHead';
import UserTabBar from './TabBar';

const userQuery = gql`
  query UserDetailsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...UserScreenHead_user
    }
  }

  ${UserScreenHead.fragments.user}
`;

export default (routes, config = {}) => {
  const routerConfigs = {
    ...config,
    tabBarComponent: props => null,
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
  }

  const Tabs = createMaterialTopTabNavigator(routes, routerConfigs);
  const TabBar = createNavigator(UserTabBar, Tabs.router, routerConfigs);

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
    renderTabBar = () => <TabBar navigation={this.props.navigation} />;

    render() {
      const { navigation } = this.props;

      const screenProps = ({ data }) => {
        return {
          renderHeader: (props) => (
            <UserScreenHead
              {...props}
              user={data.user}
              navigation={navigation}
              renderTabBar={this.renderTabBar}
            />
          ),
          // contentOffset: this.state.contentOffset,
          // onScroll: (event) => {
          //   this.updateOffset(event.nativeEvent.contentOffset);
          // },
        };
      };

      const userId = navigation.state.params.id;

      return (
        <Container>
          <Query query={userQuery} variables={{ userId }}>
            {(queryResult) => (
              <Tabs navigation={navigation} screenProps={screenProps(queryResult)} />
            )}
          </Query>
        </Container>
      );
    }
  };
}
