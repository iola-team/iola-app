import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const userUpdateSubscription = gql`
  subscription UserUpdateSubscription($userId: ID!) {
    onUserUpdate(userId: $userId) {
      user {
        id
        isApproved
      }
    }
  }
`;

export default class PendingApprovalSubscription extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    onSubscriptionData: PropTypes.func.isRequired,
  };

  onSubscriptionData = ({ subscriptionData }) => {
    this.props.onSubscriptionData(subscriptionData.data.onUserUpdate.user);
  };

  render() {
    const { userId } = this.props;

    return (
      <Subscription
        subscription={userUpdateSubscription}
        variables={{ userId }}
        onSubscriptionData={this.onSubscriptionData}
      />
    );
  }
}
