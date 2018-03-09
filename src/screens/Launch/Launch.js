import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Container, View, Text, Button, Spinner } from 'native-base';
import styled from 'styled-components/native';

import * as routes from '../roteNames';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default class LaunchScreen extends Component {
  componentWillReceiveProps(newProps) {
    const {
      navigation: { navigate },
      data: { loading, me },
    } = newProps;

    if (loading) {
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
    return (
      <Container>
        <Wrap>
          <Spinner />
        </Wrap>
      </Container>
    );
  }
}
