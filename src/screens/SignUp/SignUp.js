import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Text, View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import { Background, Logo, TouchableOpacity } from '~components';
import SignUpForm from './SignUpForm';
import { EULA, LAUNCH } from '../routeNames';

const Title = connectToStyleSheet('title', Text);
const AlreadyHaveAnAccountContainer = connectToStyleSheet('alreadyHaveAnAccountContainer', View);
const AlreadyHaveAnAccountText = connectToStyleSheet('alreadyHaveAnAccountText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', TouchableOpacity);
const ButtonSignInText = connectToStyleSheet('buttonSignInText', Text);

@styleSheet('iola.SignUpScreen', {
  content: {
    alignSelf: 'center',
    width: '100%',
    minWidth: 320,
    paddingBottom: 30,
    paddingHorizontal: '10%',
  },

  title: {
    marginBottom: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
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
    const {
      navigation: { goBack, navigate },
      styleSheet: styles,
    } = this.props;

    return (
      <Container>
        <Background />
        <SafeAreaView style={{ flex: 1 }}>
          <Content contentContainerStyle={styles.content}>
            <Logo />
            <Title>Please sign up</Title>
            <SignUpForm
              onSubmit={() => navigate(LAUNCH, { loading: true })}
              onLicenseAgreementPress={() => navigate(EULA)}
            />
            <AlreadyHaveAnAccountContainer>
              <AlreadyHaveAnAccountText>Already have an account?</AlreadyHaveAnAccountText>
              <ButtonSignIn onPress={() => goBack()}>
                <ButtonSignInText>Sign in</ButtonSignInText>
              </ButtonSignIn>
            </AlreadyHaveAnAccountContainer>
          </Content>
        </SafeAreaView>
      </Container>
    );
  }
}
