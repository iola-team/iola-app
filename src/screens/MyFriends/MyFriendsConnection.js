import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get, filter } from 'lodash';

import { FriendList } from 'components';

const userFriendsQuery = gql`
  query MyFriendsQuery {
    me {
      id
      friends(filter: {
        friendshipStatusIn: [ACTIVE, PENDING]
      }) {
        edges {
          ...FriendList_edge
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($input: AddFriendInput!) {
    addFriend(input: $input) {
      friendship {
        id
        status
      }
    }
  }
`;


const deleteFriendMutation = gql`
  mutation DeleteFriendMutation($input: DeleteFriendInput!) {
    deleteFriend(input: $input) {
      deletedId
    }
  }
`;

@graphql(userFriendsQuery, {
  skip: props => !!props.skip,
})
@graphql(addFriendMutation, {
  name: 'addFriend',
})
@graphql(deleteFriendMutation, {
  name: 'deleteFriend',
})
export default class MyFriendsConnection extends Component {
  static propTypes = {
    data: PropTypes.object,
    skip: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    skip: false,
  };

  onAcceptPress = async ({ node, friendship }) => {
    const { addFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: node.id,
      status: 'ACTIVE',
    };

    addFriend({
      variables: { input },
      optimisticResponse: {
        addFriend: {
          __typename: 'AddFriendPayload',
          friendship: {
            ...friendship,
            status: 'ACTIVE',
          },
        },
      },
    });
  };

  onIgnorePress = async ({ node, friendship }) => {
    const { addFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: node.id,
      status: 'IGNORED',
    };

    addFriend({
      variables: { input },
      optimisticResponse: {
        addFriend: {
          __typename: 'AddFriendPayload',
          friendship: {
            ...friendship,
            status: 'IGNORED',
          },
        },
      },

      update: (cache, { data: { addFriend: mutationData } }) => {
        const { friendship: { id: friendshipId } } = mutationData;
        const data = cache.readQuery({ query: userFriendsQuery });

        /**
         * Remove friendship from cache
         */
        data.me.friends.edges = filter(data.me.friends.edges, ({ friendship: { id } }) => (
          friendshipId !== id
        ));

        cache.writeQuery({ query: userFriendsQuery, data });
      },
    });
  };

  onCancelPress = async ({ node, friendship }) => {
    const { deleteFriend, data: { me } } = this.props;
    const input = {
      userId: me.id,
      friendId: node.id,
    };

    deleteFriend({
      variables: { input },
      optimisticResponse: {
        deleteFriend: {
          __typename: 'DeleteFriendPayload',
          deletedId: friendship.id,
        },
      },

      update: (cache, { data: { deleteFriend: mutationData } }) => {
        const { deletedId: friendshipId } = mutationData;
        const data = cache.readQuery({ query: userFriendsQuery });

        /**
         * Remove friendship from cache
         */
        data.me.friends.edges = filter(data.me.friends.edges, ({ friendship: { id } }) => (
          friendshipId !== id
        ));

        cache.writeQuery({ query: userFriendsQuery, data });
      },
    });
  };

  render() {
    const { data: { loading, me }, skip, ...props } = this.props;
    const edges = get(me, 'friends.edges', []);

    return (
      <FriendList
        {...props}
        edges={edges}
        loading={skip || loading}
        noContentText="No friends"

        onAcceptPress={this.onAcceptPress}
        onIgnorePress={this.onIgnorePress}
        onCancelPress={this.onCancelPress}
      />
    );
  }
}