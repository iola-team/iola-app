import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { Container, Text, View } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import { LAUNCH } from '../routeNames';
import SignUpForm from './SignUpForm';

const Title = connectToStyleSheet('title', Text);
const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const TermsContainer = connectToStyleSheet('termsContainer', View);
const TermsText = connectToStyleSheet('termsText', Text);
const TermsSubcontainer = connectToStyleSheet('termsSubcontainer', View);
const TermsButton = connectToStyleSheet('termsButton', TouchableOpacity);
const TermsButtonText = connectToStyleSheet('termsButtonText', Text);
const AlreadyHaveAnAccountContainer = connectToStyleSheet('alreadyHaveAnAccountContainer', View);
const AlreadyHaveAnAccountText = connectToStyleSheet('alreadyHaveAnAccountText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', TouchableOpacity);
const ButtonSignInText = connectToStyleSheet('buttonSignInText', Text);

@styleSheet('Sparkle.SignUpScreen', {
  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    paddingHorizontal: '10%',
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
    paddingHorizontal: 4,
  },

  termsButtonText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
    color: '#FFFFFF',
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
    paddingHorizontal: 4,
  },

  buttonSignInText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
})
export default class SignUpScreen extends Component {
  render() {
    const { navigation: { goBack, navigate } } = this.props;

    return (
      <Container>
        <Background>
          <SafeAreaView style={{ flex: 1 }}>
            <Content>
              <Title>Please sign up</Title>

              <SignUpForm onSubmit={() => navigate(LAUNCH)} />

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
          </SafeAreaView>
        </Background>
      </Container>
    );
  }
}
