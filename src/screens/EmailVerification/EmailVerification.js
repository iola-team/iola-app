import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Container, Text, View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import { Icon } from '~components';
import ForgotPasswordForm from './EmailVerificationForm';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Content = connectToStyleSheet('content', View);
const Header = connectToStyleSheet('header', View);
const EmailIcon = connectToStyleSheet('lockIcon', Icon).withProps({ name: 'envelope' });
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
    width: '100%',
    paddingHorizontal: '10%',
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
    fontSize: 19,
    lineHeight: 48,
    textAlign: 'center',
    color: '#BCBFCA',
    backgroundColor: '#FFFFFF',
  },

  title: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  description: {
    paddingTop: 22,
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
