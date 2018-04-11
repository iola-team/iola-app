import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

@styleSheet('Sparkle.ProfileEditScreen')
export default class ProfileEditScreen extends Component {
  static navigationOptions = {
    title: 'Profile Edit',
  };

  render() {
    const { styleSheet } = this.props;

    return (
      <Container>
        <Content padder>
          <Text>Profile Edit</Text>
        </Content>
      </Container>
    );
  }
}
