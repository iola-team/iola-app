import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Button, Text } from 'native-base';

import { withStyleSheet } from 'theme';
import { UserHeading } from 'components';
import * as routes from '../roteNames';

const userQuery = gql`
  query DashboardHeadingQuery {
    user: me {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

@withStyleSheet('Sparkle.DashboardScreenHead', {
  button: {
    width: '30%',
    alignSelf: 'center',
  }
})
export default class DashboardHeading extends PureComponent {
  static HEIGHT = UserHeading.HEIGHT;

  render() {
    const { navigation: { goBack, navigate }, styleSheet: styles, ...props } = this.props;

    return (
      <Query query={userQuery}>
        {({ data: { user }, loading }) => (
          <UserHeading {...props} highlight loading={loading} user={user}>
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
