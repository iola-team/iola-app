import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Container, Text, View } from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import ForgotPasswordForm from './ForgotPasswordForm';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const Header = connectToStyleSheet('header', View);
const LockIcon = connectToStyleSheet('lockIcon', Icon).withProps({ name: 'lock' });
const Title = connectToStyleSheet('title', Text);
const Description = connectToStyleSheet('description', Text);
const Footer = connectToStyleSheet('footer', View);
const FooterText = connectToStyleSheet('footerText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', TouchableOpacity);
const ButtonSignInText = connectToStyleSheet('buttonSignInText', Text);

@styleSheet('Sparkle.ForgotPasswordScreen', {
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

  header: {
    alignItems: 'center',
    marginTop: 34,
    marginBottom: 45,
  },

  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    fontSize: 24,
    lineHeight: 48,
    textAlign: 'center',
color: 'red',
    backgroundColor: '#FFFFFF',
  },

  title: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  description: {
    paddingTop: 22,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 33,
  },

  footerText: {
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
export default class ForgotPasswordScreen extends Component {
  render() {
    const { navigation: { goBack } } = this.props;

    return (
      <Container>
        <Background>
          <Content>
            <Header>
              <LockIcon />
              <Title>Forgot your password?</Title>
              <Description>
                Enter your email below and we’ll{'\n'}
                send you password reset{'\n'}
                instructions
              </Description>
            </Header>

            <ForgotPasswordForm onSubmit={() => alert('Get new password')} />

            <Footer>
              <FooterText>Remember your password?</FooterText>
              <ButtonSignIn onPress={() => goBack()}>
                <ButtonSignInText>Sign in</ButtonSignInText>
              </ButtonSignIn>
            </Footer>
          </Content>
        </Background>
      </Container>
    );
  }
}
