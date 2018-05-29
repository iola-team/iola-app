import React, { Component } from 'react';
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

export default class InputContainer extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    const { type, ...props } = this.props;
    const Component = types[type];

    return (
      <Component {...props} />
    );
  }
}
