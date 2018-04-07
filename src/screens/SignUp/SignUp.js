import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Text, View } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import SignUpForm from './Form';

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};
const Title = connectToStyleSheet('title', Text);
const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const TermsAndConditionsContainer = connectToStyleSheet('termsAndConditionsContainer', View);
const TermsAndConditionsText = connectToStyleSheet('termsAndConditionsText', Text);
const TermsAndConditionsSubcontainer = connectToStyleSheet('termsAndConditionsSubcontainer', View);
const TermsAndConditionsButton = connectToStyleSheet('termsAndConditionsButton', Button);
const TermsAndConditionsButtonText = connectToStyleSheet('termsAndConditionsButtonText', Text);
const AlreadyHaveAnAccountContainer = connectToStyleSheet('alreadyHaveAnAccountContainer', View);
const AlreadyHaveAnAccountText = connectToStyleSheet('alreadyHaveAnAccountText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', Button).withProps({ ...disableShadowOnAndroid });
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

  termsAndConditionsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },

  termsAndConditionsText: {
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  termsAndConditionsButton: {
    height: 29,
    marginTop: -5,
    marginHorizontal: -11,
    backgroundColor: 'transparent',
  },

  termsAndConditionsButtonText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
  },

  termsAndConditionsSubcontainer: {
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
  render() {
    const { navigation: { goBack } } = this.props;

    return (
      <Container>
        <Background>
          <Content>
            <Title>Please sign up</Title>

            <SignUpForm onSubmit={() => alert('Sign up')} />

            <TermsAndConditionsContainer>
              <TermsAndConditionsText>By signing up, you agree</TermsAndConditionsText>
              <TermsAndConditionsSubcontainer>
                <TermsAndConditionsText>to the</TermsAndConditionsText>
                <TermsAndConditionsButton onPress={() => alert('Terms and Conditions')}>
                  <TermsAndConditionsButtonText>Terms and Conditions</TermsAndConditionsButtonText>
                </TermsAndConditionsButton>
              </TermsAndConditionsSubcontainer>
            </TermsAndConditionsContainer>

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
