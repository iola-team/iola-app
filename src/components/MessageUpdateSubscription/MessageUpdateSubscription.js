import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import MessageList from '../MessageList';

const messageUpdateSubscription = gql`
  subscription MessageUpdateSubscription($userId: ID!) {
    onMessageUpdate(userId: $userId) {
      edge {
        ...MessageList_edge
      }
      chat {
        id
        unreadMessages: messages(filter: {
          notReadBy: $userId
        }) {
          totalCount
        }
      }
    }
  }

  ${MessageList.fragments.edge}
`;

export default class MessageUpdateSubscription extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId, ...props } = this.props;

    return (
      <Subscription
        {...props}
        subscription={messageUpdateSubscription}
        variables={{
          userId,
        }}
      />
    );
  }
}
