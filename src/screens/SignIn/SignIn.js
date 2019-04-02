import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import SignInForm from './SignInForm';
import * as routes from '../routeNames';

const meQuery = gql`
  query meQuery {
    me {
      id
      isApproved
      isEmailVerified
    }
  }
`;

@styleSheet('Sparkle.SignInScreen', {
  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
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
    let isApproved = false;
    let isEmailVerified = false;

    try {
      authenticated = await authenticate(login, password);
    } catch (error) {
      // @TODO: handle the error?
    }

    setStatus({ ...status, success: authenticated });

    try {
      if (authenticated) {
        const {data: {me}} = await apolloClient.query({query: meQuery});

        isApproved = me.isApproved;
        isEmailVerified = me.isEmailVerified;
      }
    } catch (error) {
      // @TODO: handle the error?
    }

    setSubmitting(false);

    if (authenticated) {
      if (!isEmailVerified) {
        navigate(routes.EMAIL_VERIFICATION);

        return;
      }

      if (!isApproved) {
        navigate(routes.PENDING_APPROVAL);

        return;
      }

      navigate(routes.APPLICATION);
    }
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
          <Content padder contentContainerStyle={styles.content}>
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
        </ImageBackground>
      </Container>
    );
  }
}
