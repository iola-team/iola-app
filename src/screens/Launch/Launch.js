import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Container, Content as RNContent, View, Text, Button, Spinner } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import * as routes from '../routeNames';

const Content = connectToStyleSheet((styleSheet) => ({
  contentContainerStyle: styleSheet.content,
}), RNContent);

@styleSheet('Sparkle.LaunchScreen', {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default class LaunchScreen extends Component {
  componentWillReceiveProps(newProps) {
    const {
      navigation: { navigate },
      data: { loading, me },
    } = newProps;

    if (loading && !me) {
      return;
    }

    if (me) {
      navigate(routes.APPLICATION);
    } else {
      navigate(routes.AUTHENTICATION);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { styleSheet } = this.props;

    return (
      <Container>
        <Content>
          <Spinner />
        </Content>
      </Container>
    );
  }
}
