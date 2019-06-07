import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Text, List, ListItem, Right, Body, Icon } from 'native-base';

import { ScrollView } from '../TabNavigator';

export default class SettingList extends Component {
  openUrl = url => () => Linking.openURL(url);

  render() {
    const { ...props } = this.props;

    /**
     * TODO: retreave this urls from website configs
     */
    const termsUrl = 'http://demo.oxpro.org/oxwall/terms-of-use';
    const policyUrl = 'http://demo.oxpro.org/oxwall/privacy-policy';

    return (
      <ScrollView {...props}>
        <List>
          <ListItem icon button first onPress={this.openUrl(policyUrl)}>
            <Body>
              <Text>Privacy Policy</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon button last onPress={this.openUrl(termsUrl)}>
            <Body>
              <Text>Terms of Use</Text>
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
