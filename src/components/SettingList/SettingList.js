import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Body, Icon, List, ListItem, Right, Text } from 'native-base';
import { LICENSE_AGREEMENT_URL, PRIVACY_POLICY_URL } from 'react-native-dotenv';

import DeleteMyProfile from './DeleteMyProfile';
import { ScrollView } from '../TabNavigator';

export default class SettingList extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  openUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    }
  };

  render() {
    const { navigation, ...props } = this.props;

    return (
      <ScrollView {...props}>
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

        <DeleteMyProfile navigation={navigation} />
      </ScrollView>
    );
  }
}
