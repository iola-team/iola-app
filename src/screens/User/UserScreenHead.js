import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Text, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserHeading, FriendsButton } from '~components';
import * as routes from '../routeNames';

const userQuery = gql`
  query UserDetailsQuery($userId: ID!, $meId: ID!) {
    me {
      id
    }

    user: node(id: $userId) {
      id
      ... on User {
        isBlocked(by: $meId)
      }

      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

const unBlockUserMutation = gql`
  mutation UserActionsUnBlockUser($userId: ID!, $blockedUserId: ID!) {
    unBlockUser(input: {
      userId: $userId
      blockedUserId: $blockedUserId
    }) {
      unBlockedUser {
        id
        isBlocked(by: $userId)
      }
    }
  }
`;

@withStyleSheet('iola.UserScreenHead', {
  buttons: {
    flexDirection: 'row',
    width: '100%',
  },

  button: {
    width: '30%',
    alignSelf: 'center',
    marginHorizontal: 5,
  }
})
@graphql(gql`query { me { id } }`, { options: { fetchPolicy: 'cache-first' } })
@graphql(userQuery, {
  skip: ({ data: { me } }) => !me?.id,
  options: ({ navigation, data: { me } }) => ({
    variables: {
      meId: me.id,
      userId: navigation.state.params.id,
    },
  }),
})
@graphql(unBlockUserMutation, { name: 'unBlockUser' })
export default class UserScreenHead extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  componentDidMount() {
    const { addListener, data } = this.props;

    addListener('refetch', () => data.refetch());
  }

  unBlockUser = async () => {
    const { unBlockUser, data: { me, user } } = this.props;

    await unBlockUser({
      variables: { userId: me.id, blockedUserId: user.id },
      optimisticResponse: {
        unBlockUser: {
          __typename: 'UnBlockUserPayload',
          unBlockedUser: {
            ...user,
            isBlocked: false,
          },
        },
      },
    });
  };

  render() {
    const {
      styleSheet: styles,
      data: {
        loading,
        user,
      },
      navigation: {
        navigate,
        state: {
          params: {
            id: userId,
          },
        }
      },
      ...props
    } = this.props;

    const buttons = user?.isBlocked ? (
      <Button
        block
        secondary
        style={styles.button}
        onPress={this.unBlockUser}
      >
        <Text>Unblock</Text>
      </Button>
    ) : (
      <>
        <Button
          block
          style={styles.button}
          onPress={() => navigate(routes.CHANNEL, { userId })}
        >
          <Text>Chat</Text>
        </Button>

        <FriendsButton block style={styles.button} userId={userId} />
      </>
    );

    return (
      <UserHeading {...props} loading={loading} user={user}>
        <View style={styles.buttons}>
          {user && buttons}
        </View>
      </UserHeading>
    );
  }
}
