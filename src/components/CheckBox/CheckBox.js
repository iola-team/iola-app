import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyleSheet as styleSheet } from '~theme';
import TouchableOpacity from '../TouchableOpacity';
import Icon from '../Icon';

@styleSheet('iola.CheckBox', {
  checkbox: {
    alignItems: 'center',
    width: 24,
    height: 24,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, .5)',
  },

  icon: {
    paddingLeft: 3,
    fontSize: 11,
    lineHeight: 24,
    color: '#FFFFFF',
  },
})
export default class CheckBox extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
  };

  render() {
    const { onPress, checked, styleSheet: styles, } = this.props;

    return (
      <TouchableOpacity style={styles.checkbox} onPress={onPress}>
        {checked && <Icon name="check" style={styles.icon} />}
      </TouchableOpacity>
    );
  }
}
