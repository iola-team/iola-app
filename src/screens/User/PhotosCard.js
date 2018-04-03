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
    fragment PhotosCard_user on User {
      id
    }
  `
};

export default class PhotosCard extends PureComponent {
  static fragments = fragments;
  static propTypes = {
    user: fragmentProp(fragments.data),
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
