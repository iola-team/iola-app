import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as ViewRN } from 'react-native';
import { View, Text, Icon } from 'native-base';

import { withStyle } from 'theme';

// images, people

@withStyle('Sparkle.NoContent', {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

  'NativeBase.ViewNB': {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,

    'NativeBase.Icon': {
      color: '#C5CAD1',
      fontSize: 120,
    },
  },

  'NativeBase.Text': {
    color: '#C5CAD1',
    fontSize: 16,
  },
})
export default class NoContnet extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string,
  };

  static defaultProps = {
    text: null,
  };

  render() {
    const { icon, text, ...props } = this.props;

    return (
      <ViewRN {...props}>
        <View highlight>
          <Icon name={icon} />
        </View>

        {text && <Text>{text}</Text>}
      </ViewRN>
    );
  }
}
