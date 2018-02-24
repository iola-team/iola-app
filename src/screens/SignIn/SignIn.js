import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { Button, Container, Form, Input, Item, Label, Text, View } from 'native-base';

import { SIGN_UP } from '../roteNames';

export default ({ navigation: { navigate } }) => {
  const Background = styled(View)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `;
  const Content = styled(View)`
    flex: 1;
    align-self: center;
    justify-content: center;
    width: 100%;
    max-width: 400px;
    margin: 50px 10%;
    background-color: transparent;
  `;
  const Title = styled(Text)`
    margin-bottom: 20%;
    font-size: 36px;
    font-weight: 500;
    text-align: center;
    color: white;
  `;
  const disableShadowOnAndroid = {
    shadowColor: 'transparent',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation: 0,
  };
  const FormButtonFacebook = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
    height: 50px;
    border-radius: 10px;
    background-color: #6D83CC;
  `;
  const TextBold = styled(Text)`
    font-weight: 500;
    font-size: 16px;
  `;
  const FormContent = styled(View)`
    justify-content: center;
  `;
  const FormTextOrContainer = styled(View)`
    flex-direction: row;
    margin: 30px 0 35px;
  `;
  const FormTextOrLeft = styled(View)`
    flex: 1;
    border-bottom-width: 1px;
    border-bottom-color: white;
    opacity: .5;
  `;
  const FormTextOrRight = styled(View)`
    flex: 1;
    border-bottom-width: 1px;
    border-bottom-color: white;
    opacity: .5;
  `;
  const FormTextOr = styled(Text)`
    margin: 0 3px -5px;
    font-size: 12px;
    text-align: center;
    color: white;
  `;
  const FormItem = styled(Item).attrs({ regular: true })`
    margin-bottom: 15px;
    padding: 0 10px;
    border-radius: 10px;
    border-color: rgba(255, 255, 255, .6);
  `;
  const FormInput = styled(Input).attrs({ placeholderTextColor: 'white' })`
    font-size: 16px;
    color: white;
  `;
  const FormButtonForgotPassword = styled(Button).attrs({ transparent: true })`
    height: 50px;
    margin-right: -8px;
  `;
  const FormButtonForgotPasswordText = styled(Text)`
    font-size: 12px;
    color: white;
  `;
  const FormButtonSignIn = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
    width: 55%;
    height: 50px;
    margin-top: 10%;
    align-self: center;
    border-radius: 10px;
    background-color: ${props => props.theme.accent};
  `;
  const FormButtonSignUp = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
    width: 55%;
    height: 50px;
    margin-top: 15px;
    align-self: center;
    border-radius: 10px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, .6);
    background-color: transparent;
  `;

  return (
    <Container>
      <Background>
        <Image style={{ resizeMode: 'cover', width: null, height: '100%' }} source={{ uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' }} />
      </Background>
      <Content>
        <Title>Sign in</Title>
        <FormContent>
          <FormButtonFacebook onPress={() => alert('Log in via Facebook')}>
            <TextBold>Log in via Facebook</TextBold>
          </FormButtonFacebook>
          <FormTextOrContainer>
            <FormTextOrLeft />
            <FormTextOr>or</FormTextOr>
            <FormTextOrRight />
          </FormTextOrContainer>
          <Form>
            <FormItem>
              <FormInput placeholder="Login" />
            </FormItem>
            <FormItem>
              <FormInput placeholder="Password" secureTextEntry={true} />
              <FormButtonForgotPassword onPress={() => alert('Forgot password?')}>
                <FormButtonForgotPasswordText>Forgot password?</FormButtonForgotPasswordText>
              </FormButtonForgotPassword>
            </FormItem>
            <FormButtonSignIn onPress={() => alert('Sign in')}>
              <TextBold>Sign in</TextBold>
            </FormButtonSignIn>
          </Form>
          <FormButtonSignUp onPress={() => navigate(SIGN_UP)}>
            <TextBold>Sign up</TextBold>
          </FormButtonSignUp>
        </FormContent>
      </Content>
    </Container>
  );
};
