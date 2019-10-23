import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Body, Icon, List, ListItem, Right, Text } from 'native-base';
import { LICENSE_AGREEMENT_URL, PRIVACY_POLICY_URL } from 'react-native-dotenv';

import { ScrollView } from '../TabNavigator';

export default class SettingList extends Component {
  static propTypes = {
    onBlockedUsersPress: PropTypes.func.isRequired,
    onLicenseAgreementPress: PropTypes.func.isRequired,
  };

  openUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    }
  };

  render() {
    const { onBlockedUsersPress, onLicenseAgreementPress } = this.props;

    return (
      <ScrollView {...this.props}>
        <List>
          <ListItem icon button first onPress={onBlockedUsersPress}>
            <Body>
              <Text>Blocked users</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon button onPress={() => this.openUrl(PRIVACY_POLICY_URL)}>
            <Body>
              <Text>Privacy Policy</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon button last onPress={onLicenseAgreementPress}>
            <Body>
              <Text>License Agreement</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </ScrollView>
    );
  }
}
