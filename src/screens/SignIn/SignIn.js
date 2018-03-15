import React, { Component } from 'react';
import { Image, Keyboard, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';
import { withProps } from 'recompose';
import { connectStyle, Title, Button, Container, Content, Form, Input, Item, Label, Text, View, H1 } from 'native-base';

import { withStyleSheet as styleSheet } from '../../theme';

import { SIGN_UP, LAUNCH } from '../roteNames';
import LoginForm from './Form';
import Divider from './Divider';

@styleSheet('Sparkle.SignInScreen', {
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  backgroundImage: {
    resizeMode: 'cover',
    width: null,
    height: '100%',
  },

  divider: {
    marginVertical: 30,
  },

  facebookButton: {
    backgroundColor: '#6D83CC',
  },

  button: {
    width: '55%',
    alignSelf: 'center',
    marginTop: 15,
  },

  title: {
    marginBottom: '20%',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 30,
  },
})
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
    const { authenticate, navigation: { navigate }, styleSheet } = this.props;
    const { keyboardHeight } = this.state;

    return (
      <Container>
        <View style={styleSheet.background}>
          <Image
            style={styleSheet.backgroundImage}
            source={{ uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' }}
          />
        </View>

        <Content padder contentContainerStyle={styleSheet.content}>
          <H1 style={styleSheet.title}>Sign in</H1>

          <Button block style={styleSheet.facebookButton} onPress={() => alert('Log in via Facebook')}>
            <Text>Log in via Facebook</Text>
          </Button>

          <Divider style={styleSheet.divider}>or</Divider>

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

          <Button block bordered light style={styleSheet.button} onPress={() => navigate(SIGN_UP)}>
            <Text>Sign up</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
