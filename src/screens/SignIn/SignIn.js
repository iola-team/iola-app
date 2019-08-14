import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Button, Container, Content, Text, H1, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { Image } from '~components';
import SignInForm from './SignInForm';
import * as routes from '../routeNames';
import defaultBackground from './defaultBackground.jpg'; // @TODO: Make it dynamic with admin plugin
import defaultLogo from './defaultLogo.png';

@styleSheet('Sparkle.SignInScreen', {
  background: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
  },

  backgroundShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 46, 0.4)',
  },

  content: {
    alignSelf: 'center',
    width: '100%',
    minWidth: 320,
    paddingHorizontal: '10%',
    paddingBottom: 30,
  },

  logo: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    marginTop: 34,
    marginBottom: 18,
    borderRadius: 8,
  },

  title: {
    marginBottom: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  button: {
    marginTop: 8,
  },
})
export default class SignInScreen extends Component {
  state = { defaultEmail: '' };

  onSubmit = async ({ login, password }, { setSubmitting, status, setStatus }) => {
    const { authenticate, navigation: { navigate } } = this.props;
    let authenticated = false;

    try {
      authenticated = await authenticate(login, password);
    } catch (error) {
      // TODO: handle the error?
    }

    if (authenticated) {
      navigate(routes.LAUNCH, { loading: true });
    }

    setStatus({ ...status, success: authenticated });
    setSubmitting(false);
  };

  onForgotPassword = (login) => {
    const { navigation: { navigate } } = this.props;

    navigate({
      routeName: routes.FORGOT_PASSWORD,
      params: {
        defaultLogin: login,
        setDefaultEmail: defaultEmail => this.setState({ defaultEmail }),
      },
    });
  };

  render() {
    const {
      navigation: { dangerouslyGetParent, navigate },
      screenProps: { onApplicationReset },
      styleSheet: styles,
    } = this.props;
    const backgroundUrl = dangerouslyGetParent().getParam('backgroundUrl');
    const backgroundImage = backgroundUrl ? { uri: backgroundUrl } : defaultBackground;
    const logoUrl = dangerouslyGetParent().getParam('logoUrl');
    const logoImage = logoUrl ? { uri: logoUrl } : defaultLogo;

    return (
      <Container>
        <Image style={styles.background} source={backgroundImage} />
        <View style={styles.backgroundShadow} />
        <SafeAreaView style={{ flex: 1 }}>
          <Content contentContainerStyle={styles.content}>
            <Image style={styles.logo} source={logoImage} />
            <H1 style={styles.title}>Sign in</H1>
            <SignInForm
              defaultEmail={this.state.defaultEmail}
              onSubmit={(values, formikBag) => this.onSubmit(values, formikBag)}
              onForgotPassword={login => this.onForgotPassword(login)}
            />
            <Button
              style={styles.button}
              onPress={() => navigate(routes.SIGN_UP)}
              block
              bordered
              light
            >
              <Text>Sign up</Text>
            </Button>
            <Button style={styles.button} onPress={onApplicationReset} block bordered light>
              <Text>Change Website URL</Text>
            </Button>
          </Content>
        </SafeAreaView>
      </Container>
    );
  }
}
