import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { UsersRow } from '~components';

@graphql(gql`
  query MyOnlineFriendsQuery {
    me {
      id
      friends (filter: { online: true }) {
        edges {
          ...UsersRow_edge
        }
      }
    }
  }

  ${UsersRow.fragments.edge}
`)
export default class OnlinFriendsList extends PureComponent {
  componentDidMount() {
    const { navigation, data } = this.props;

    /**
     * TODO: Temporary solution, till we add online users `graphql` subscriptions
     * https://gitlab.com/thisissparkle/messenger/issues/337
     * 
     */
    navigation.addListener('didFocus', () => {
      data.refetch();
      data.startPolling(3000);
    });

    navigation.addListener('willBlur', () => data.stopPolling());
  }

  render() {
    const { data: { loading, me }, ...props } = this.props;

    return (
      <UsersRow
        {...props}

        loading={loading}
        edges={me?.friends.edges}

        noContentText="No friends online"
      />
    );
  }
}