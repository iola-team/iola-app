import React, { Component } from 'react';
import { Container } from 'native-base';

import { BLOCKED_USERS, EULA } from '../routeNames';
import { withStyleSheet } from '~theme';
import { SettingList } from '~components';
import DeleteMyProfile from './DeleteMyProfile';

@withStyleSheet('iola.SettingsScreen')
export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    const { screenProps, navigation: { navigate } } = this.props;

    return (
      <Container>
        <SettingList
          onBlockedUsersPress={() => navigate(BLOCKED_USERS)}
          onLicenseAgreementPress={() => navigate(EULA)}
          contentInset={{ ...screenProps.contentInset, bottom: 0 }}
        />
        <DeleteMyProfile />
      </Container>
    );
  }
}
