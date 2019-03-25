import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Container, Text, View } from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { Icon } from '~components';
import PendingApprovalSubscription from './PendingApprovalSubscription';
import * as routes from '../routeNames';

// @TODO: Make it dynamical with admin plugin
const backgroundURL = 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg';

const meQuery = gql`
  query meQuery {
    me {
      id
    }
  }
`;

@styleSheet('Sparkle.PendingApprovalScreen', {
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
    marginBottom: 28,
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

  description: {
    paddingTop: 22,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
})
export default class EmailVerificationScreen extends Component {
  onSuccess() {
    alert('Success!');
  }

  onResend() {
    alert('Resend the verification code');
  }

  onUserApproved = ({ isApproved }) => {
    const { navigation: { navigate } } = this.props;

    if (isApproved) navigate(routes.DASHBOARD);
  };

  render() {
    const { styleSheet: styles } = this.props;

    return (
      <Container>
        <ImageBackground style={styles.background} source={{ uri: backgroundURL }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Icon style={styles.icon} name="envelope" />
              <Text style={styles.title}>Account Pending Approval</Text>
              <Text style={styles.description}>
                Your account is currently pending approval.{'\n'}
                Please wait until the review is completed by administration.
              </Text>
            </View>
          </View>
        </ImageBackground>
        <Query query={meQuery}>
          {({ data: { me }, loading }) => !loading && (
            <PendingApprovalSubscription userId={me.id} onSubscriptionData={this.onUserApproved} />
          )}
        </Query>
      </Container>
    );
  }
}
