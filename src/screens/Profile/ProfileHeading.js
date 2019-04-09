import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Button, Text } from 'native-base';

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
  heading: {
    paddingTop: 50,
  },

  button: {
    width: '30%',
    alignSelf: 'center',
  }
})
export default class ProfileHeading extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  render() {
    const { navigation: { goBack, navigate }, styleSheet: styles, ...props } = this.props;

    return (
      <Query query={userQuery}>
        {({ data: { user }, loading }) => (
          <UserHeading foreground {...props} style={styles.heading} loading={loading} user={user}>
            <Button
              light
              bordered
              secondary
              block
              style={styles.button}
              onPress={() => navigate(routes.PROFILE_EDIT)}
            >
              <Text>Edit Profile</Text>
            </Button>
          </UserHeading>
        )}
      </Query>
    );
  }
}
