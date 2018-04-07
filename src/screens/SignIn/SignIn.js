import React, { Component } from 'react';
import { Image, ImageBackground, Keyboard, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { withProps } from 'recompose';
import { Button, Container, Content, Input, Item, Label, Text, View, H1 } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import { SIGN_UP, LAUNCH } from '../roteNames';
import LoginForm from './Form';
import Divider from './Divider';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Title = connectToStyleSheet('title', H1);
const TextBold = connectToStyleSheet('textBold', Text);
const ButtonFacebook = connectToStyleSheet('buttonFacebook', Button);
const ButtonSignup = connectToStyleSheet('buttonSignup', Button);

@styleSheet('Sparkle.SignInScreen', {
  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    paddingLeft: '5%',
    paddingRight: '5%',
  },

  background: {
    height: '100%',
  },

  title: {
    marginVertical: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  textBold: {
    fontWeight: 'bold',
  },

  buttonFacebook: {
    backgroundColor: '#6D83CC',
  },

  buttonSignup: {
    marginTop: 8,
  },
})
export default class SignInScreen extends Component {
  render() {
    const { authenticate, navigation: { navigate }, styleSheet } = this.props;

    return (
      <Container>
        <Background>
          <Content padder contentContainerStyle={styleSheet.content}>
            <Title>Sign in</Title>

            <ButtonFacebook block onPress={() => alert('Log in via Facebook')}>
              <TextBold>Log in via Facebook</TextBold>
            </ButtonFacebook>

            <Divider>or</Divider>

            <LoginForm
              onSubmit={async (values) => {
                const success = await authenticate(values.login, values.password);

                if (success) {
                  navigate(LAUNCH);
                }
              }}
              onForgotPasswordPress={() => {
                alert('Forgot password?');
              }}
            />

            <ButtonSignup block bordered light onPress={() => navigate(SIGN_UP)}>
              <TextBold>Sign up</TextBold>
            </ButtonSignup>
          </Content>
        </Background>
      </Container>
    );
  }
}
