import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag'

import MessageList from '../MessageList'

const messageUpdateSubscription = gql`
  subscription MessageUpdateSubscription($userId: ID!) {
    onMessageUpdate(userId: $userId) {
      edge {
        ...MessageList_edge
      }
    }
  }

  ${MessageList.fragments.edge}
`;

export default class MessageUpdateSubscription extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    children: PropTypes.func,
  };

  static defaultProps = {
    children: () => null,
  };

  render() {
    const { userId, children } = this.props;

    return (
      <Subscription
        children={children}
        subscription={messageUpdateSubscription}
        variables={{
          userId,
        }}
      />
    );
  }
}
