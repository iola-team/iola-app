import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Text, View } from 'native-base';

import { withStyleSheet } from '~theme';
import { UserHeading } from '~components';
import * as routes from '../routeNames';

const userQuery = gql`
  query ProfileHeadingQuery {
    user: me {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

@withStyleSheet('Sparkle.ProfileScreenHead', {
  buttons: {
    flexDirection: 'row',
    width: '100%',
  },

  button: {
    height: 50,
    width: '30%',
    alignSelf: 'center',
    marginHorizontal: 5,
  },

  buttonText: {
    textAlign: 'center',
  },
})
@graphql(userQuery)
export default class ProfileHeading extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  componentDidMount() {
    const { addListener, data } = this.props;

    addListener('refetch', () => data.refetch());
  }

  render() {
    const { navigation: { goBack, navigate }, styleSheet: styles, data, ...props } = this.props;

    return (
      <UserHeading {...props} loading={data.loading} user={data.user}>
        <View style={styles.buttons}>
          <Button
            light
            bordered
            secondary
            block
            style={styles.button}
            onPress={() => navigate(routes.PROFILE_EDIT)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Button>

          <Button
            light
            bordered
            secondary
            block
            style={styles.button}
            onPress={() => navigate(routes.SETTINGS)}
          >
            <Text>Settings</Text>
          </Button>
        </View>
      </UserHeading>
    );
  }
}
