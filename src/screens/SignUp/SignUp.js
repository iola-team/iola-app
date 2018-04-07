import React, { Component } from 'react';
import { Image } from 'react-native';
import { Button, Container, Form, Input, Item, Label, Text, View } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import { SIGN_IN } from '../roteNames';

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};
const Title = connectToStyleSheet('title', Text);
const Background = connectToStyleSheet('background', View);
const Content = connectToStyleSheet('content', View);
const TextBold = connectToStyleSheet('textBold', Text);
const FormContent = connectToStyleSheet('formContent', View);
const FormItem = connectToStyleSheet('formItem', Item).withProps({ regular: true });
const FormInput = connectToStyleSheet('formInput', Input).withProps({ placeholderTextColor: 'white' });
const ButtonSignUp = connectToStyleSheet('buttonSignUp', Button).withProps({
  block: true,
  ...disableShadowOnAndroid,
});
const BottomTextContainer = connectToStyleSheet('bottomTextContainer', View);
const BottomText = connectToStyleSheet('bottomText', Text);
const ButtonSignIn = connectToStyleSheet('buttonSignIn', Button).withProps({ ...disableShadowOnAndroid });
const ButtonSignInText = connectToStyleSheet('buttonSignInText', Text);

@styleSheet('Sparkle.SignUpScreen', {
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 50,
    paddingHorizontal: '10%',
    backgroundColor: 'transparent',
  },

  title: {
    marginVertical: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: 'white',
  },

  textBold: {
    fontWeight: '500',
    fontSize: 16,
  },

  formContent: {
    justifyContent: 'center',
  },

  formItem: {
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: 'rgba(255, 255, 255, .6)',
  },

  formInput: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  signUpButton: {
    height: 50,
    marginTop: '10%',
    alignSelf: 'center',
    borderRadius: 10,
  },

  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  bottomText: {
    color: 'white',
  },

  buttonSignIn: {
    height: 30,
    marginTop: -5,
    backgroundColor: 'transparent',
  },

  buttonSignInText: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
})
export default class SignUpScreen extends Component {
  render() {
    const { navigation: {
      goBack
    }} = this.props;

    return (
      <Container>
        <Background>
          <Image style={{ resizeMode: 'cover', width: null, height: '100%' }} source={{ uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' }} />
        </Background>
        <Content>
          <Title>Please sign up</Title>
          <FormContent>
            <Form>
              <FormItem>
                <FormInput placeholder="Full Name" />
              </FormItem>
              <FormItem>
                <FormInput placeholder="Email" />
              </FormItem>
              <FormItem>
                <FormInput placeholder="Password" secureTextEntry={true} />
              </FormItem>
              <ButtonSignUp onPress={() => alert('Sign up')}>
                <TextBold>Sign up</TextBold>
              </ButtonSignUp>
            </Form>
            <BottomTextContainer>
              <BottomText>Already have an account?</BottomText>
              <ButtonSignIn onPress={() => goBack()}>
                <ButtonSignInText>Sign in</ButtonSignInText>
              </ButtonSignIn>
            </BottomTextContainer>
          </FormContent>
        </Content>
      </Container>
    );
  }
}
