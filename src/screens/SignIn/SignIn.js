import React, { Component } from 'react';
import { Image, Keyboard, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';

import { Button, Container, Content, Form, Input, Item, Label, Text, View } from 'native-base';

import { SIGN_UP, LAUNCH } from '../roteNames';
import LoginForm from './Form';

const disableShadowOnAndroid = {
  shadowColor: 'transparent',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0,
  elevation: 0,
};

const Background = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Title = styled(Text)`
  margin-bottom: 20%;
  font-size: 36px;
  font-weight: 500;
  text-align: center;
  color: white;
`;

const FacebookButton = styled(Button).attrs({ block: true, ...disableShadowOnAndroid })`
  height: 50px;
  border-radius: 10px;
  background-color: #6D83CC;
`;

const Bold = styled(Text)`
  font-weight: 500;
  font-size: 16px;
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

const Delimiter = styled(View)`
  flex-direction: row;
  margin: 30px 0 35px;
`;

const DelimiterLine = styled(View)`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: white;
  opacity: .5;
`;

const DelimiterLabel = styled(Text)`
  margin: 0 3px -5px;
  font-size: 12px;
  text-align: center;
  color: white;
`;

const Wrapper = styled(Animatable.View).attrs({
  useNativeDriver: true,
  easing: 'ease',
  transition: ['translateY'],
  duration: 400,
})`
  justify-content: center;
  flex: 1;
  transform: translateY(${props => -props.bottomOffset || 0}px);
`;

const HeadSection = styled(Animatable.View).attrs({
  useNativeDriver: true,
  easing: 'ease',
  transition: ['opacity', 'scale'],
  duration: 400,
})`
  opacity: ${props => props.visible ? 1 : 0};
  transform: scale(${props => props.visible ? 1 : 0.6});
`;

export default class SignInScreen extends Component {
  state = {
    keyboardHeight: 0,
  };

  componentWillMount () {
    this.keyboardListeners = [
      Keyboard.addListener('keyboardDidShow', this.onKeyboardUpdate),
      Keyboard.addListener('keyboardDidHide', this.onKeyboardUpdate)
    ];
  }

  componentWillUnmount() {
    this.keyboardListeners.forEach(listener => listener.remove());
  }

  onKeyboardUpdate = (event) => {
    const {
      endCoordinates: { height = 0 } = {}
    } = event || {};

    this.setState({
      keyboardHeight: height,
    });
  };

  render() {
    const { authenticate, navigation: { navigate } } = this.props;
    const { keyboardHeight } = this.state;

    return (
      <Container>
        <Background>
          <Image style={{ resizeMode: 'cover', width: null, height: '100%' }} source={{ uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' }} />
        </Background>

        <Content padder contentContainerStyle={{ flex: 1 }}>
          <Wrapper bottomOffset={keyboardHeight}>
            <HeadSection visible={!keyboardHeight}>
              <Title>Sign in</Title>
              <FacebookButton onPress={() => alert('Log in via Facebook')}>
                <Bold>Log in via Facebook</Bold>
              </FacebookButton>

              <Delimiter>
                <DelimiterLine />
                <DelimiterLabel>or</DelimiterLabel>
                <DelimiterLine />
              </Delimiter>
            </HeadSection>

            <LoginForm
              onSubmit={async (values) => {
                const success = await authenticate(values.login, values.password);

                if (success) {
                  navigate(LAUNCH);
                }
              }}
              onForgotPasswordPress={() => {
                alert('Forgot password?');
              }}
            />

            <FormButtonSignUp onPress={() => navigate(SIGN_UP)}>
              <Bold>Sign up</Bold>
            </FormButtonSignUp>
          </Wrapper>
        </Content>
      </Container>
    );
  }
}
