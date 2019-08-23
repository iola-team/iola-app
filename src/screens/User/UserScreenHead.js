import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Text, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserHeading, FriendsButton } from '~components';
import * as routes from '../routeNames';

const userQuery = gql`
  query UserDetailsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

@withStyleSheet('iola.UserScreenHead', {
  buttons: {
    flexDirection: 'row',
    width: '100%',
  },

  button: {
    height: 50,
    width: '30%',
    alignSelf: 'center',
    marginHorizontal: 5,
  }
})
@graphql(userQuery, {
  options: ({ navigation }) => ({
    variables: {
      userId: navigation.state.params.id,
    },
  }),
})
export default class UserScreenHead extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  componentDidMount() {
    const { addListener, data } = this.props;

    addListener('refetch', () => data.refetch());
  }

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

    return (
      <UserHeading {...props} loading={loading} user={user}>
        <View style={styles.buttons}>
          <Button
            block
            style={styles.button}
            onPress={() => navigate(routes.CHANNEL, { userId })}
          >
            <Text>Chat</Text>
          </Button>

          <FriendsButton block style={styles.button} userId={userId} />
        </View>
      </UserHeading>
    );
  }
}
