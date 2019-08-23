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

import { withStyleSheet as styleSheet } from '~theme';

const userFragment = gql`
  fragment UserBriefCard_user on User {
    info {
      location
      about
    }
  }
`;

@styleSheet('iola.UserBriefCard')
export default class UserBriefCard extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  render() {
    const { user: { info } } = this.props;

    return (
      <Card transparent>
        <CardItem header>
          <Icon name="ios-pricetag-outline" />
          <Text>{info.location}</Text>
        </CardItem>
        <CardItem>
          <Text>{info.about}</Text>
        </CardItem>
      </Card>
    );
  }
}
