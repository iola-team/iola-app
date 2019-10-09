import React, { Component } from 'react';
import { Container } from 'native-base';

import { BLOCKED_USERS } from '../routeNames';
import { withStyleSheet } from '~theme';
import { SettingList } from '~components';
import DeleteMyProfile from './DeleteMyProfile';

@withStyleSheet('iola.SettingsScreen')
export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  showBlockedUsers = () => {
    const { navigation } = this.props;
    navigation.navigate(BLOCKED_USERS);
  };

  render() {
    const { screenProps } = this.props;

    return (
      <Container>
        <SettingList
          onBlockedUsersPress={this.showBlockedUsers}
          contentInset={{ ...screenProps.contentInset, bottom: 0 }}
        />
        <DeleteMyProfile />
      </Container>
    );
  }
}
