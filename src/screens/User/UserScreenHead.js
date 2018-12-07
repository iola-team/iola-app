import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { UserHeading } from 'components';
import * as routes from '../roteNames';

const userQuery = gql`
  query UserDetailsQuery($userId: ID!) {
    user: node(id: $userId) {
      id
      ...UserHeading_user
    }
  }

  ${UserHeading.fragments.user}
`;

@styleSheet('Sparkle.UserScreenHead', {
  head: {
    marginTop: 55,
    marginBottom: 40,
  },
})
export default class UserScreenHead extends PureComponent {
  render() {
    const {
      style,
      styleSheet: styles,
      navigation: { goBack, navigate, state },
    } = this.props;

    return (
      <View style={style} highlight>
        <Query query={userQuery} variables={{ userId: state.params.id }}>
          {({ data: { user }, loading }) => (
            <UserHeading
              style={styles.head}
              loading={loading}
              user={user}
              onBackPress={() => goBack()}
              onChatPress={() => navigate(routes.CHANNEL, { userId: state.params.id })}
            />
          )}
        </Query>
      </View>
    );
  }
}
