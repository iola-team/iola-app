import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Text } from 'native-base';

import { withStyle } from '~theme';
import FieldView from './FieldView';
import TouchableOpacity from '../TouchableOpacity';

@withStyle('iola.TextView')
export default class TextView extends Component {
  state = {
    isLink: false,
  };

  onLinkPress = () => Linking.openURL(this.getUrl());
  renderLink() {
    const { styleSheet: styles, value } = this.props;

    return (
      <TouchableOpacity primary onPress={this.onLinkPress}>
        <Text>{value}</Text>
      </TouchableOpacity>
    );
  }

  getUrl() {
    const { value, displayType } = this.props;

    if (!['url', 'email'].includes(displayType)) {
      return null;
    }

    return `${displayType === 'email' ? 'mailto:' : ''}${value}`;
  }

  componentDidMount() {
    const url = this.getUrl();

    if (url) {
      Linking.canOpenURL(url).then((isLink) => this.setState({ isLink }));
    }
  }

  render() {
    const {
      value,
      secure,
      displayType,
      ...props
    } = this.props;

    const { isLink } = this.state;

    /**
     * TODO: handle secure presentation properly
     */
    return (
      <FieldView
        {...props}
      >
        {isLink ? this.renderLink() : (
          <Text>
            {value && (secure ? 'Secure' : value)}
          </Text>
        )}
      </FieldView>
    );
  }
}
