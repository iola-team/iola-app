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
      isBlocked(by: $userId)
    }

    user: node(id: $userId) {
      ... on User {
        id
        isBlocked(by: $meId)

        ...UserHeading_user
      }
    }
  }

  ${UserHeading.fragments.user}
`;

const unblockUserMutation = gql`
  mutation UserActionsUnblockUser($userId: ID!, $blockedUserId: ID!) {
    unblockUser(input: {
      userId: $userId
      blockedUserId: $blockedUserId
    }) {
      unblockedUser {
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
  },

  blockedLabel: {
    color: '#F95356',
    textAlign: 'center',
  },
})
@graphql(gql`query { me { id } }`, { name: 'meData', options: { fetchPolicy: 'cache-first' } })
@graphql(userQuery, {
  skip: ({ meData: { me } }) => !me?.id,
  options: ({ navigation, meData: { me } }) => ({
    variables: {
      meId: me.id,
      userId: navigation.state.params.id,
    },
  }),
})
@graphql(unblockUserMutation, { name: 'unblockUser' })
export default class UserScreenHead extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  componentDidMount() {
    const { addListener, data } = this.props;

    addListener('refetch', () => data.refetch());
  }

  unblockUser = async () => {
    const { unblockUser, data: { me, user } } = this.props;

    await unblockUser({
      variables: { userId: me.id, blockedUserId: user.id },
      optimisticResponse: {
        unblockUser: {
          __typename: 'UnblockUserPayload',
          unblockedUser: {
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
        me,
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

    const renderButtons = (isBlocked) => (
      isBlocked ? (
        <Button
          block
          secondary
          style={styles.button}
          onPress={this.unblockUser}
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
      )
    );

    return (
      <UserHeading {...props} loading={loading} user={user}>
        <View style={styles.buttons}>
          {
            user && me &&
              (me.isBlocked
                ? (
                  <Text style={styles.blockedLabel}>
                    This user chooses not
                    {'\n'}
                    to interact with you
                  </Text>
                ) : renderButtons(user.isBlocked)
              )
          }
        </View>
      </UserHeading>
    );
  }
}
