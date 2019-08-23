import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { Background, Icon, LogoutButton, UserUpdateSubscription } from '~components';
import * as routes from '../routeNames';

const meQuery = gql`
  query meQuery {
    me {
      id
    }
  }
`;

@styleSheet('iola.PendingApprovalScreen', {
  background: {
    flex: 1,
  },

  backgroundShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 46, 0.4)',
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
  onUserUpdate = ({ isApproved }) => {
    if (!isApproved) return;

    const { navigation: { navigate } } = this.props;

    navigate(routes.LAUNCH, { loading: true });
  };

  render() {
    const { styleSheet: styles } = this.props;

    return (
      <Container>
        <Background />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Icon style={styles.icon} name="envelope" />
              <Text style={styles.title}>Account Pending Approval</Text>
              <Text style={styles.description}>
                Your account is currently pending approval.{'\n'}
                Please wait until the review is completed by administration.
              </Text>
            </View>
            <LogoutButton button bordered />
          </View>
        </SafeAreaView>
        <Query query={meQuery}>
          {({ data: { me }, loading }) => !loading && (
            <UserUpdateSubscription userId={me.id} onSubscriptionData={this.onUserUpdate} />
          )}
        </Query>
      </Container>
    );
  }
}
