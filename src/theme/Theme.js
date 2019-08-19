import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleProvider, clearThemeCache } from 'native-base-shoutem-theme';

import getTheme from './default/components';
import themeVariables from './default/variables';

export default class Theme extends Component {
  static propTypes = {
    variables: PropTypes.object,
  };

  static defaultProps = {
    variables: {},
  };

  constructor(...args) {
    super(...args);

    clearThemeCache();
  }

  render() {

    /**
     * TODO: Find a way to not mutate default props
     */
    const variables = Object.assign(themeVariables, this.props.variables);

    return (
      <StyleProvider style={getTheme(variables)}>
        {this.props.children}
      </StyleProvider>
    );
  }
}
