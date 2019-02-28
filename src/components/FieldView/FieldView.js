import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Body } from 'native-base';

import { withStyle } from '~theme';
import FieldItem from '../FieldItem';

@withStyle('Sparkle.FieldView')
export default class FieldView extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    last: PropTypes.bool,
  };

  static defaultProps = {
    last: false,
  };

  render() {
    const { label, children, ...props } = this.props;

    return(
      <FieldItem {...props}>
        <Label>{label}</Label>
        <Body>{children}</Body>
      </FieldItem>
    );
  }
}
