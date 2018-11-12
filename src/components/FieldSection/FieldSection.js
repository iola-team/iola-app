import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Text,
} from 'native-base';

export default class FieldSection extends PureComponent {
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

        <CardItem cardBody highlight horizontalPadder>
          {children}
        </CardItem>
      </Card>
    );
  }
}
