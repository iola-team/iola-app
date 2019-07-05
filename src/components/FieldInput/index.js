import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

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

export default class FieldInputContainer extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFinishEditing: PropTypes.func,
  };

  static defaultProps = {
    onFinishEditing: noop,
  };

  render() {
    const { type, ...props } = this.props;
    const Field = types[type];

    return (
      <Field {...props} />
    );
  }
}
