import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleProvider } from 'native-base';
import getTheme from './default/components';
import themeVariables from './default/variables';

export * from './utils';

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

    console.log('Rerender Theme');

    return (
      <StyleProvider style={getTheme(variables)}>
        {this.props.children}
      </StyleProvider>
    )
  }
}
