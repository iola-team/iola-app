import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Container, Text, View } from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import ForgotPasswordForm from './EmailVerificationForm';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const Header = connectToStyleSheet('header', View);
const EmailIcon = connectToStyleSheet('lockIcon', Icon).withProps({ name: 'envelope-letter' });
const Title = connectToStyleSheet('title', Text);
const Description = connectToStyleSheet('description', Text);

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
    marginBottom: 28,
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
})
export default class EmailVerificationScreen extends Component {
  onSuccess() {
    alert('Success!');
  }

  onResend() {
    alert('Resend the verification code');
  }

  render() {
    return (
      <Container>
        <Background>
          <Content>
            <Header>
              <EmailIcon />
              <Title>Email verification</Title>
              <Description>
                Verification code has been sent to:{'\n'}
                roman.banan@gmail.com (@TODO)
              </Description>
            </Header>

            <ForgotPasswordForm onSuccess={this.onSuccess} onResend={this.onResend} />
          </Content>
        </Background>
      </Container>
    );
  }
}
