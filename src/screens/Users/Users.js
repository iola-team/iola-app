import React, { PureComponent } from 'react';
import { Container, View } from 'native-base';

import { TabBarIcon, SearchBar, TouchableOpacity } from '~components';
import { withStyleSheet } from '~theme';
import { USER, USER_SEARCH } from '../routeNames';
import UsersConnection from './UsersConnection';

@withStyleSheet('Sparkle.UsersScreen', {
  listHeader: {
     /**
     * TODO: rethink
     * Prevent scroll bounce to show screen background
     */
    paddingTop: 999,
    marginTop: -999,
  },

  searchBar: {
    paddingTop: 0,
  },
})
export default class DashboardAll extends PureComponent {
  static navigationOptions = {
    title: 'Users',
    tabBarIcon: ({ tintColor: color }) => (
      <TabBarIcon name="friends-bar" style={{ color, fontSize: 35 }} />
    ),
  };

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate({ routeName: USER, params: { id }, key: id });
  };

  onSearchPress = () => this.props.navigation.navigate(USER_SEARCH);

  render() {
    const { styleSheet: styles, screenProps } = this.props;

    return (
      <Container>
        <UsersConnection
          ListHeaderComponent={(
            <View foreground style={styles.listHeader}>
              <TouchableOpacity onPress={this.onSearchPress}>
                <View style={styles.searchBar} padder pointerEvents="box-only">
                  <SearchBar placeholder="Search users" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          onItemPress={this.onItemPress}
          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
