import React, { Component } from 'react';
import Moment from 'react-moment';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import FieldView from './FieldView';

@withStyle('iola.DateView')
export default class DateView extends Component {
  render() {
    const {
      value,
      label,
      ...props
    } = this.props;

    return (
      <FieldView
        label={label}
        {...props}
      >
        {!!value && (
          <Moment element={Text} format="MMMM D, YYYY">{value}</Moment>
        )}
      </FieldView>
    );
  }
}
