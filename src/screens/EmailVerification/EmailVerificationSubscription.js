import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'native-base';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const emailVerificationSubscription = gql`
  subscription UserEmailVerifiedSubscription($userId: ID!) {
    onUserUpdate(userId: $userId) {
      user {
        id
        isApproved
        isEmailVerified
      }
    }
  }
`;

export default class EmailVerificationSubscription extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    onSubscriptionData: PropTypes.func.isRequired,
  };

  onSubscriptionData = ({ subscriptionData }) => {
    try {
      this.props.onSubscriptionData(subscriptionData.data.onUserUpdate.user);
    } catch {
      Toast.show({
        text: 'Something went wrong',
        duration: 5000,
        buttonText: 'Ok',
        type: 'danger',
      });
    }
  };

  render() {
    const { userId } = this.props;

    return (
      <Subscription
        subscription={emailVerificationSubscription}
        variables={{ userId }}
        onSubscriptionData={this.onSubscriptionData}
      />
    );
  }
}
