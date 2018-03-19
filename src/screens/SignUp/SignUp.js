import React, { Component } from 'react';
import { Image } from 'react-native';
import { Button, Container, Form, Input, Item, Label, Text, View } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

import { SIGN_IN } from '../roteNames';

const Background = connectToStyleSheet('background', View, {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

const Content = connectToStyleSheet('content', View, {
  flex: 1,
  alignSelf: 'center',
  justifyContent: 'center',
  width: '100%',
  marginVertical: 50,
  paddingHorizontal: '10%',
  backgroundColor: 'transparent',
});

const Title = connectToStyleSheet('title', Text, {
  marginBottom: '20%',
  fontSize: 36,
  fontWeight: '500',
  textAlign: 'center',
  color: '#FFFFFF',
});

const TextBold = connectToStyleSheet('textBold', Text, {
  fontWeight: '500',
  fontSize: 16,
});

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};

const FormContent = connectToStyleSheet('formContent', View, {
  justifyContent: 'center',
});

const FormItem = connectToStyleSheet('formItem', Item, {
  marginBottom: 15,
  paddingVertical: 0,
  paddingHorizontal: 10,
  borderRadius: 10,
  borderColor: 'rgba(255, 255, 255, .6)',
})
.withProps({ regular: true });

const FormInput = connectToStyleSheet('formInput', Input, {
  fontSize: 16,
  color: '#FFFFFF',
})
.withProps({
  placeholderTextColor: 'white'
});

const FormButtonSignUp = connectToStyleSheet('signUpButton', Button, {
  width: '55%',
  height: 50,
  marginTop: '10%',
  alignSelf: 'center',
  borderRadius: 10,
})
.withProps({
  block: true,
  ...disableShadowOnAndroid
});

const BottomTextContainer = connectToStyleSheet('bottomTextContainer', View, {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
});

const BottomText = connectToStyleSheet('bottomText', Text, {
  color: '#FFFFFF',
});

const ButtonSignIn = connectToStyleSheet('signInButton', Button, {
  height: 30,
  marginTop: -5,
  backgroundColor: 'transparent',
})
.withProps({ ...disableShadowOnAndroid });

const ButtonSignInText = connectToStyleSheet('signInButtonText', Text, {
  paddingVertical: 0,
  paddingHorizontal: 10,
  textDecorationLine: 'underline',
});

@styleSheet('Sparkle.SignUpScreen')
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
              <FormButtonSignUp onPress={() => alert('Sign up')}>
                <TextBold>Sign up</TextBold>
              </FormButtonSignUp>
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
