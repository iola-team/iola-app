import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Button, Text, View } from 'native-base';

import { withStyleSheet } from 'theme';
import { UserHeading } from 'components';
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

@withStyleSheet('Sparkle.UserScreenHead', {
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
export default class UserScreenHead extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  render() {
    const {
      styleSheet: styles,
      navigation: {
        goBack,
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
      <Query query={userQuery} variables={{ userId }}>
        {({ data: { user }, loading }) => (
          <UserHeading {...props} highlight loading={loading} user={user}>
            <View style={styles.buttons}>
              <Button
                block
                style={styles.button}
                onPress={() => navigate(routes.CHANNEL, { userId })}
              >
                <Text>Chat</Text>
              </Button>

              <Button light bordered secondary block style={styles.button}>
                <Text>Friends</Text>
              </Button>
            </View>
          </UserHeading>
        )}
      </Query>
    );
  }
}
