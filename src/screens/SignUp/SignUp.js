import React, { Component } from 'react';
import { Linking, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { LICENSE_AGREEMENT_URL } from 'react-native-dotenv';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import { TouchableOpacity, Image } from '~components';
import SignUpForm from './SignUpForm';
import { LAUNCH } from '../routeNames';
import defaultBackground from '../SignIn/defaultBackground.jpg';
import defaultLogo from '../SignIn/defaultLogo.png';

const Title = connectToStyleSheet('title', Text);
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
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
  },

  backgroundShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 46, 0.4)',
  },

  content: {
    alignSelf: 'center',
    width: '100%',
    minWidth: 320,
    paddingBottom: 30,
    paddingHorizontal: '10%',
  },

  logo: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    marginTop: 34,
    marginBottom: 18,
    borderRadius: 8,
  },

  title: {
    marginBottom: 34,
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
  openUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    }
  };

  render() {
    const {
      navigation: { dangerouslyGetParent, goBack, navigate },
      styleSheet: styles,
    } = this.props;
    const backgroundUrl = dangerouslyGetParent().getParam('backgroundUrl');
    const backgroundImage = backgroundUrl ? { uri: backgroundUrl } : defaultBackground;
    const logoUrl = dangerouslyGetParent().getParam('logoUrl');
    const logoImage = logoUrl ? { uri: logoUrl } : defaultLogo;

    return (
      <Container>
        <Image style={styles.background} source={backgroundImage} />
        <View style={styles.backgroundShadow} />
        <SafeAreaView style={{ flex: 1 }}>
          <Content contentContainerStyle={styles.content}>
            <Image style={styles.logo} source={logoImage} />
            <Title>Please sign up</Title>
            <SignUpForm onSubmit={() => navigate(LAUNCH, { loading: true })} />
            <TermsContainer>
              <TermsText>By signing up, you agree</TermsText>
              <TermsSubcontainer>
                <TermsText>to the</TermsText>
                <TermsButton onPress={() => this.openUrl(LICENSE_AGREEMENT_URL)}>
                  <TermsButtonText>License Agreement</TermsButtonText>
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
      </Container>
    );
  }
}
