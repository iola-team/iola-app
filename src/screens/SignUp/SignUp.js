import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Text, View } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import SignUpForm from './Form';
import { LAUNCH } from '../roteNames';

const Title = connectToStyleSheet('title', Text);
const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const TermsContainer = connectToStyleSheet('termsContainer', View);
const TermsText = connectToStyleSheet('termsText', Text);
const TermsSubcontainer = connectToStyleSheet('termsSubcontainer', View);
const TermsButton = connectToStyleSheet('termsButton', Button);
const TermsButtonText = connectToStyleSheet('termsButtonText', Text);
const AlreadyHaveAnAccountContainer = connectToStyleSheet('alreadyHaveAnAccountContainer', View);
const AlreadyHaveAnAccountText = connectToStyleSheet('alreadyHaveAnAccountText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', Button);
const ButtonSignInText = connectToStyleSheet('buttonSignInText', Text);

@styleSheet('Sparkle.SignUpScreen', {
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

  termsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },

  termsText: {
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  termsButton: {
    height: 29,
    marginTop: -5,
    marginHorizontal: -11,
    backgroundColor: 'transparent',
  },

  termsButtonText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
  },

  termsSubcontainer: {
    flexDirection: 'row',
  },

  alreadyHaveAnAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 33,
  },

  alreadyHaveAnAccountText: {
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  buttonSignIn: {
    height: 30,
    marginTop: -5,
    marginHorizontal: -4,
    backgroundColor: 'transparent',
  },

  buttonSignInText: {
    fontSize: 14,
    lineHeight: 19,
    paddingVertical: 0,
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
})
export default class SignUpScreen extends Component {
  onSubmit = async ({ name, email, password }) => {
    const success = await this.props.create(name, email, password);

    if (success) this.props.navigation.navigate(LAUNCH);
  };

  render() {
    const { navigation: { goBack } } = this.props;

    return (
      <Container>
        <Background>
          <Content>
            <Title>Please sign up</Title>

            <SignUpForm onSubmit={this.onSubmit} />

            <TermsContainer>
              <TermsText>By signing up, you agree</TermsText>
              <TermsSubcontainer>
                <TermsText>to the</TermsText>
                <TermsButton onPress={() => alert('Terms and Conditions')}>
                  <TermsButtonText>Terms and Conditions</TermsButtonText>
                </TermsButton>
              </TermsSubcontainer>
            </TermsContainer>

            <AlreadyHaveAnAccountContainer>
              <AlreadyHaveAnAccountText>Already have an account?</AlreadyHaveAnAccountText>
              <ButtonSignIn onPress={() => goBack()}>
                <ButtonSignInText>Sign in</ButtonSignInText>
              </ButtonSignIn>
            </AlreadyHaveAnAccountContainer>
          </Content>
        </Background>
      </Container>
    );
  }
}
