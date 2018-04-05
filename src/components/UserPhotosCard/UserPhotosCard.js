import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Icon,
  Text,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';

const userFragment = gql`
  fragment UserPhotosCard_user on User {
    id
  }
`;

@styleSheet('Sparkle.UserPhotosCard')
export default class UserPhotosCard extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  render() {
    const { user } = this.props;

    return (
      <Card transparent topBorder>
        <CardItem header>
          <Text>Photos 12</Text>
        </CardItem>
        <CardItem>
          <Text>Photo list...</Text>
        </CardItem>
      </Card>
    );
  }
}
