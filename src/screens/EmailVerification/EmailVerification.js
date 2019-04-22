import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Container, Text, View } from 'native-base';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { Icon, Spinner, UserUpdateSubscription } from '~components';
import EmailVerificationForm from './EmailVerificationForm';
import * as routes from '../routeNames';

// @TODO: Make it dynamical with admin plugin
const backgroundURL = 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg';

const meQuery = gql`
  query meQuery {
    me {
      id
      email
    }
  }
`;

const sendEmailVerificationInstructionsMutation = gql`
  mutation($input: EmailVerificationInstructionsInput!) {
    result: sendEmailVerificationInstructions(input: $input) {
      success
      errorCode
    }
  }
`;

@styleSheet('Sparkle.ForgotPasswordScreen', {
  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    paddingHorizontal: '10%',
  },

  header: {
    alignItems: 'center',
    marginTop: 34,
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    fontSize: 19,
    lineHeight: 48,
    textAlign: 'center',
    color: '#BCBFCA',
    backgroundColor: '#FFFFFF',
  },

  title: {
    textAlign: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  info: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },

  description: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  spinner: {
    color: '#FFFFFF',
  },
})
export default class EmailVerificationScreen extends Component {
  state = {
    isSubmitting: false,
    error: '',
  };

  async onSubmit(email, sendEmailVerificationInstructions) {
    this.setState({ isSubmitting: true });

    try {
      let error = '';
      const {
        data: {
          result: {
            errorCode,
          },
        },
      } = await sendEmailVerificationInstructions({
        variables: {
          input: {
            email,
          },
        },
      });

      switch (errorCode) {
        case 'COMMON':
          error = 'Something went wrong\nPlease try again later';
          break;
        case 'NOT_FOUND':
          error = `User with email\n${email}\nwas not found`;
          break;
      }

      this.setState({ isSubmitting: false, error });
    } catch (error) {
      this.setState({
        isSubmitting: false,
        error: 'Something went wrong\nPlease try again later',
      });
    }
  }

  onSuccess() {
    // @TODO: Iteration 2 (Email Verification with short code)
  }

  onUserUpdate = ({ isEmailVerified }) => {
    if (!isEmailVerified) return;

    const { navigation: { navigate } } = this.props;

    navigate(routes.LAUNCH, { loading: true });
  };

  render() {
    const { styleSheet: styles } = this.props;
    const { isSubmitting, error } = this.state;

    return (
      <Query query={meQuery}>
        {({ data: { me }, loading }) => {
          const email = loading ? null : me.email;
          const infoContent = (
            <Text style={styles.description}>
              {error ? error : `Verification code has been sent to:\n${email}`}
            </Text>
          );

          return (
            <Container>
              <ImageBackground style={styles.background} source={{ uri: backgroundURL }}>
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Icon style={styles.icon} name="envelope" />
                    <Text style={styles.title}>Email verification</Text>
                    <View style={styles.info}>
                      {!loading && !isSubmitting ? infoContent : <Spinner style={styles.spinner} />}
                    </View>
                  </View>

                  <Mutation mutation={sendEmailVerificationInstructionsMutation}>
                    {sendEmailVerificationInstructions => !loading && (
                      <EmailVerificationForm
                        onSubmit={() => this.onSubmit(email, sendEmailVerificationInstructions)}
                        onSuccess={this.onSuccess}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </Mutation>
                </View>
              </ImageBackground>
              {!loading && <UserUpdateSubscription userId={me.id} onSubscriptionData={this.onUserUpdate} />}
            </Container>
          );
        }}
      </Query>
    );
  }
}
