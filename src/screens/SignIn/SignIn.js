import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import * as routes from '../roteNames';
import SignInForm from './SignInForm';
import Divider from './Divider';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Title = connectToStyleSheet('title', H1);
const FacebookButton = connectToStyleSheet('facebookButton', Button);
const SignUpButton = connectToStyleSheet('signUpButton', Button);

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

  facebookButton: {
    backgroundColor: '#6D83CC',
  },

  signUpButton: {
    marginTop: 8,
  },
})
export default class SignInScreen extends Component {
  onSubmit = async ({ login, password }, { setSubmitting, status, setStatus }) => {
    const success = await this.props.authenticate(login, password);

    setStatus({ ...status, success });
    setSubmitting(false);

    if (success) this.props.navigation.navigate(routes.LAUNCH);
  };

  render() {
    const { navigation: { navigate }, styleSheet } = this.props;

    return (
      <Container>
        <Background>
          <Content padder contentContainerStyle={styleSheet.content}>
            <Title>Sign in</Title>

            <FacebookButton block onPress={() => alert('Log in via Facebook')}>
              <Text>Log in via Facebook</Text>
            </FacebookButton>

            <Divider>or</Divider>

            <SignInForm
              onSubmit={this.onSubmit}
              onForgotPassword={login => navigate({
                routeName: routes.FORGOT_PASSWORD,
                params: { login },
              })}
            />

            <SignUpButton block bordered light onPress={() => navigate(routes.SIGN_UP)}>
              <Text>Sign up</Text>
            </SignUpButton>
          </Content>
        </Background>
      </Container>
    );
  }
}
