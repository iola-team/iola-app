import React, { Component } from 'react';
import { Image, ImageBackground, Keyboard, Platform } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import { SIGN_UP, LAUNCH } from '../roteNames';
import SignInForm from './Form';
import Divider from './Divider';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Title = connectToStyleSheet('title', H1);
const ButtonFacebook = connectToStyleSheet('buttonFacebook', Button);
const ButtonSignup = connectToStyleSheet('buttonSignup', Button);

@styleSheet('Sparkle.SignInScreen', {
  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    paddingLeft: '5%',
    paddingRight: '5%',
  },

  title: {
    marginVertical: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  buttonFacebook: {
    backgroundColor: '#6D83CC',
  },

  buttonSignup: {
    marginTop: 8,
  },
})
export default class SignInScreen extends Component {
  onSubmit = async ({ login, password }) => {
    const success = await this.props.authenticate(login, password);

    if (success) this.props.navigation.navigate(LAUNCH);
  };

  render() {
    const { navigation: { navigate }, styleSheet } = this.props;

    return (
      <Container>
        <Background>
          <Content padder contentContainerStyle={styleSheet.content}>
            <Title>Sign in</Title>

            <ButtonFacebook block onPress={() => alert('Log in via Facebook')}>
              <Text>Log in via Facebook</Text>
            </ButtonFacebook>

            <Divider>or</Divider>

            <SignInForm onSubmit={this.onSubmit} onForgotPasswordPress={() => alert('Forgot password?')} />

            <ButtonSignup block bordered light onPress={() => navigate(SIGN_UP)}>
              <Text>Sign up</Text>
            </ButtonSignup>
          </Content>
        </Background>
      </Container>
    );
  }
}
