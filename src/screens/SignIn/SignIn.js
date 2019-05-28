import React, { Component } from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import SignInForm from './SignInForm';
import * as routes from '../routeNames';

// @TODO: this is for test (try to speed up the Launch screen query); DELETE IT AFTER THE SPEED MEASURING
const launchScreenQueryTest = gql`
  query {
    config {
      emailConfirmIsRequired
      userApproveIsRequired
    }
    
    me {
      id
      name
      isEmailVerified
      isApproved
    }
  }
`;

@styleSheet('Sparkle.SignInScreen', {
  background: {
    flex: 1,
  },

  content: {
    alignSelf: 'center',
    width: '100%',
    minWidth: 320,
    paddingHorizontal: '10%',
    paddingBottom: 30,
  },

  title: {
    marginVertical: 34,
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

  onSubmit = async ({ login, password }, { setSubmitting, status, setStatus }, apolloClient) => {
    const { authenticate, navigation: { navigate } } = this.props;
    let authenticated = false;

    try {
      authenticated = await authenticate(login, password);
    } catch (error) {
      // @TODO: handle the error?
    }

    if (authenticated) {
      const { data } = await apolloClient.query({ query: launchScreenQueryTest }); // @TODO: this is for test (try to speed up the Launch screen query); DELETE IT AFTER THE SPEED MEASURING

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
    const backgroundURL = 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg';

    return (
      <Container>
        <ImageBackground style={styles.background} source={{ uri: backgroundURL }}>
          <SafeAreaView style={{ flex: 1 }}>
            <Content contentContainerStyle={styles.content}>
              <H1 style={styles.title}>Sign in</H1>

              <ApolloConsumer>
                {apolloClient => (
                  <SignInForm
                    defaultEmail={this.state.defaultEmail}
                    onSubmit={(values, formikBag) => this.onSubmit(values, formikBag, apolloClient)}
                    onForgotPassword={login => this.onForgotPassword(login)}
                  />
                )}
              </ApolloConsumer>

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
        </ImageBackground>
      </Container>
    );
  }
}
