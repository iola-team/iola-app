import React, { Component } from 'react';
import { Container, Content, View, Text, Button, H1 } from 'native-base';
import styled from 'styled-components/native';

import SignInForm from '../SignInForm';

const Wraper = styled(View)`
  
`;

const Head = styled(View)`
  height: 255px;
  align-items: center;
  justify-content: center;
`;

const Form = styled(SignInForm)`
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


export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
    header: null,
  };

  render() {
    const { showSignUp, submitForm, attemptLogin, isSubmitting } = this.props;

    return (
      <Container>
        <Content>
          <Wraper>
            <Head>
              <H1>
                Please sign in
              </H1>
            </Head>

            <Form onSubmit={attemptLogin} />

            <Buttons>
              <ButtonItem onPress={submitForm} disabled={isSubmitting}>
                <Text>
                  Sign in
                </Text>
              </ButtonItem>

              <ButtonItem bordered onPress={showSignUp}>
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