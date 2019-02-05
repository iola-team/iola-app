import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Text, List, ListItem, Icon } from 'native-base';

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
          <ListItem button first onPress={this.openUrl(policyUrl)}>
            <Text>Privacy policy</Text>
          </ListItem>

          <ListItem button last onPress={this.openUrl(termsUrl)}>
            <Text>Terms of use</Text>
          </ListItem>
        </List>
      </ScrollView>
    );
  }
}
