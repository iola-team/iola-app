import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { Background, Icon, Logo } from '~components';
import * as routes from '../routeNames';
import SignInForm from './SignInForm';

@styleSheet('iola.SignInScreen', {
  content: {
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    minWidth: 320,
    minHeight: 550, // TODO: this is a robust fix of weird SafeAreaView behaviour on Android, see the issue: https://gitlab.com/iola-team/iola/issues/415
    paddingHorizontal: '10%',
    paddingBottom: 30,
  },

  title: {
    marginBottom: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  button: {
    marginTop: 8,
    marginBottom: 'auto',
  },

  changeWebsiteURLbutton: {
    marginTop: 8,
    paddingLeft: 25,
  },

  icon: {
    position: 'absolute',
    left: -3,
    fontSize: 18,
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
      navigation: { navigate },
      screenProps: { onApplicationReset },
      styleSheet: styles,
    } = this.props;

    return (
      <Container>
        <Background />
        <SafeAreaView style={{ flex: 1 }}>
          <Content contentContainerStyle={styles.content}>
            <Logo />
            <H1 style={styles.title}>Sign in</H1>
            <SignInForm
              defaultEmail={this.state.defaultEmail}
              onSubmit={(values, formikBag) => this.onSubmit(values, formikBag)}
              onForgotPassword={login => this.onForgotPassword(login)}
            />
            <Button block bordered light style={styles.button} onPress={() => navigate(routes.SIGN_UP)}>
              <Text>Sign up</Text>
            </Button>
            <Button block bordered light style={styles.changeWebsiteURLbutton} onPress={onApplicationReset}>
              <Icon name="back" style={styles.icon} />
              <Text>Change Website URL</Text>
            </Button>
          </Content>
        </SafeAreaView>
      </Container>
    );
  }
}
