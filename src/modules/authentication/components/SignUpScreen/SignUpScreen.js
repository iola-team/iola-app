import React, { Component } from 'react';
import {
  Text,
  Container,
  View,
  Body,
  Content,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Button,
  H1
} from "native-base";

import styled from 'styled-components/native';

import SignUpForm from '../SignUpForm';

const Wraper = styled(View)`
  
`;

const Head = styled(View)`
  height: 145px;
  align-items: center;
  justify-content: center;
`;

const Form = styled(SignUpForm)`
  margin-bottom: 60px;
  width: 280px;
  align-self: center;
`;

const Buttons = styled(View)`
  align-self: center;
`;

const ButtonItem = styled(Button)`
  margin-bottom: 10px;
  width: 180px;
  align-self: center;
  justify-content: center;
`;


class ScreenHeader extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack(null)}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
        <Title>Sign up</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}

export default class SignUpScreen extends Component {
  static navigationOptions = {
    header: props => <ScreenHeader {...props} />
  };

  render() {
    const { submitForm } = this.props;

    return (
      <Container>
        <Content>
          <Wraper>
            <Head>
              <H1>
                Please sign up
              </H1>
            </Head>

            <Form onSubmit={(values) => {
              console.log(values);
            }} />

            <Buttons>
              <ButtonItem onPress={submitForm}>
                <Text>
                  Sign up
                </Text>
              </ButtonItem>

            </Buttons>
          </Wraper>
        </Content>
      </Container>
    );
  }
}