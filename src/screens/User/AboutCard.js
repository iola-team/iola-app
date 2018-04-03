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

const fragments = {
  user: gql`
    fragment AboutCard_user on User {
      info {
        location
        about
      }
    }
  `
};

export default class AboutCard extends PureComponent {
  static fragments = fragments;
  static propTypes = {
    user: fragmentProp(fragments.data),
  };

  render() {
    const { user: { info } } = this.props;

    return (
      <Card transparent>
        <CardItem header>
          <Icon name={"ios-pricetag-outline"} />
          <Text>{info.location}</Text>
        </CardItem>
        <CardItem>
          <Text>{info.about}</Text>
        </CardItem>
      </Card>
    );
  }
}
