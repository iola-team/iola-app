import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleProvider, connectStyle } from 'native-base';
import getTheme from './components';
import themeVariables from './variables';

export withStyleSheet from './withStyleSheet';
export const withStyle = connectStyle;

export default class ThemeProvider extends Component {
  static propTypes = {
    variables: PropTypes.object,
  };

  static defaultProps = {
    variables: {},
  }

  render() {
    const variables = {
      ...themeVariables,
      ...this.props.variables,
    }

    return (
      <StyleProvider style={getTheme(variables)}>
        {this.props.children}
      </StyleProvider>
    )
  }
}
