import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

/**
 * Component fragment sample
 */
const userFragment = gql`
  fragment ComponentTemplate_user on User {
    id
  }
`;

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.ComponentTemplate', {
  root: {

  }
})
export default class ComponentTemplate extends Component {
  /**
   * Graphql fragments - can be used by parent components to fetch data
   */
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    /**
     * Graphql props
     */
    user: fragmentProp(userFragment).isRequired,

    /**
     * Simple props
     */
    something: PropTypes.number,
    onSomething: PropTypes.func,
  };

  static defaultProps = {
    something: 0,
    onSomething: () => {},
  };

  render() {
    const { style, onSomething, something, user } = this.props;

    console.log('User', user);

    return (
      <Root style={style}>
        <Button onPress={onSomething}>
          <Text>Hello ComponentTemplate = {something}!</Text>
        </Button>
      </Root>
    );
  }
}
