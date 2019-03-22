import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Container, Text, Toast, View } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

import { withStyleSheet as styleSheet, connectToStyleSheet } from '~theme';
import { Icon } from '~components';
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
const SignInLink = connectToStyleSheet('signInLink', TouchableOpacity);
const SignInLinkText = connectToStyleSheet('signInLinkText', Text);
const SignInButton = connectToStyleSheet('signInButton', Button);

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
    marginBottom: 45,
  },

  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    fontSize: 23,
    lineHeight: 48,
    textAlign: 'center',
    color: '#BCBFCA',
    backgroundColor: '#FFFFFF',
  },

  title: {
    paddingTop: 25,
    paddingBottom: 22,
    alignSelf: 'center',
    fontSize: 24,
    lineHeight: 29,
    color: '#FFFFFF',
  },

  description: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  signInButton: {
    marginTop: 22,
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

  signInLink: {
    paddingHorizontal: 4,
  },

  signInLinkText: {
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
})
@graphql(gql`
  mutation sendResetPasswordInstructionsMutation($input: ResetPasswordInstructionsInput!) {
    result: sendResetPasswordInstructions(input: $input) {
      success
      errorCode
    }
  }
`, {
  props: ({ mutate }) => ({
    sendResetPasswordInstructions: email => mutate({
      variables: {
        input: {
          email,
        }
      },
    }),
  }),
})
export default class ForgotPasswordScreen extends Component {
  state = {
    email: '',
    emailWasSent: false,
  };

  async onSubmit({ email }, { setSubmitting }) {
    const { sendResetPasswordInstructions } = this.props;
    let success = false;
    let errorMessage = 'Something went wrong.'; // @TODO: Add details to the message (maybe add the link "Send the request to Technical Support?)"

    setSubmitting(true);

    try {
      const { data: { result } } = await sendResetPasswordInstructions(email);

      success = result.success;

      switch (result.errorCode) {
        case 'ERROR_NOT_FOUND':
          errorMessage = 'There is no user registered with that email address.';
          break;
        case 'ERROR_DUPLICATE':
          errorMessage = 'Reset code already sent. Please try again in 10 minutes.';
          break;
      }
    } catch ($error) {
      // @TODO
    }

    setSubmitting(false);

    if (!success) {
      Toast.show({
        text: errorMessage,
        duration: 5000,
        buttonText: 'Ok',
        type: 'danger',
      });

      return;
    }

    this.setState({ email, emailWasSent: success });
  }

  goBack() {
    const { navigation: { goBack, state } } = this.props;
    const { email } = this.state;
    const setDefaultEmail = get(state, 'params.setDefaultEmail');

    setDefaultEmail(email);
    goBack();
  }

  render() {
    const { email, emailWasSent } = this.state;
    const defaultLogin = get(this.props, 'navigation.state.params.defaultLogin');
    const defaultEmail = /^.+@.+\..+$/.test(defaultLogin) ? defaultLogin : '';

    return (
      <Container>
        <Background>
          <Content>
            <Header>
              <LockIcon />
              <Title>Forgot your password?</Title>
              {emailWasSent ? (
                <>
                  <Description>
                    A new password has been sent to
                  </Description>
                  <Description>
                    {email}
                  </Description>
                  <SignInButton block onPress={::this.goBack}>
                    <Text>Sign in</Text>
                  </SignInButton>
                </>
              ) : (
                <Description>
                  Enter your email below and we’ll{'\n'}
                  send you password reset{'\n'}
                  instructions
                </Description>
              )}
            </Header>
            {emailWasSent ? null : (
              <>
                <ForgotPasswordForm onSubmit={::this.onSubmit} defaultEmail={defaultEmail} />

                <Footer>
                  <FooterText>
                    Remember your password?
                  </FooterText>
                  <SignInLink onPress={::this.goBack}>
                    <SignInLinkText>Sign in</SignInLinkText>
                  </SignInLink>
                </Footer>
              </>
            )}
          </Content>
        </Background>
      </Container>
    );
  }
}
