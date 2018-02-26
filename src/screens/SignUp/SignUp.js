import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { Button, Container, Form, Input, Item, Label, Text, View } from 'native-base';

import { SIGN_IN } from '../roteNames';

export default ({ navigation: { navigate, goBack } }) => {
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
  const TextBold = styled(Text)`
    font-weight: 500;
    font-size: 16px;
  `;
  const disableShadowOnAndroid = {
    shadowColor: 'transparent',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation: 0,
  };
  const FormContent = styled(View)`
    justify-content: center;
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
  const FormButtonSignUp = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
    width: 55%;
    height: 50px;
    margin-top: 10%;
    align-self: center;
    border-radius: 10px;
    background-color: ${props => props.theme.accent};
  `;
  const BottomTextContainer = styled(View)`
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
  `;
  const BottomText = styled(Text)`
    color: white;
  `;
  const ButtonSignIn = styled(Button).attrs({ ...disableShadowOnAndroid })`
    height: 30px;
    margin-top: -5px;
    background-color: transparent;
  `;
  const ButtonSignInText = styled(Text)`
    padding: 0 10px;
    text-decoration-line: underline;
    color: ${props => props.theme.accent};
  `;

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
};
