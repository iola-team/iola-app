import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Body, Icon, List, ListItem, Right, Text } from 'native-base';
import { LICENSE_AGREEMENT_URL, PRIVACY_POLICY_URL } from 'react-native-dotenv';

import { ScrollView } from '../TabNavigator';

export default class SettingList extends Component {
  openUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    }
  };

  render() {
    return (
      <ScrollView {...this.props}>
        <List>
          <ListItem icon button first onPress={() => this.openUrl(PRIVACY_POLICY_URL)}>
            <Body>
              <Text>Privacy Policy</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon button last onPress={() => this.openUrl(LICENSE_AGREEMENT_URL)}>
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
