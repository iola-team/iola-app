import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.SettingsScreen')
export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    const { styleSheet } = this.props;

    return (
      <Container>
        <Content padder>
          <Text>Settings</Text>
        </Content>
      </Container>
    );
  }
}
