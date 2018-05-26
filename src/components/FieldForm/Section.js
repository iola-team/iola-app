import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Text,
} from 'native-base';

export default class Section extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  render() {
    const { children, label } = this.props;

    return (
      <Card transparent>
        <CardItem header padder>
          <Text>{label}</Text>
        </CardItem>

        <CardItem cardBody highlight>
          {children}
        </CardItem>
      </Card>
    )
  }
}
