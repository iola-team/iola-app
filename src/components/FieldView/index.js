import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import Text from './Text';
import Switch from './Switch';
import Date from './Date';

const types = {
  'select': Select,
  'text': Text,
  'switch': Switch,
  'date': Date,
};

export default class FieldViewContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    const { type, ...props } = this.props;
    const Field = types[type];

    return (
      <Field {...props} />
    );
  }
}
