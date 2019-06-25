import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Text, List, ListItem, Right, Body, Icon } from 'native-base';
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
    const { ...props } = this.props;

    return (
      <ScrollView {...props}>
        <List>
          <ListItem onPress={() => this.openUrl(PRIVACY_POLICY_URL)} icon button first>
            <Body>
              <Text>Privacy Policy</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem onPress={() => this.openUrl(LICENSE_AGREEMENT_URL)} icon button last>
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
