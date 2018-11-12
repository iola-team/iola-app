import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { Text } from 'native-base';

import Navigator from 'screens';
import { ROOT_QUERY } from 'graph';

Moment.globalElement = Text;

@graphql(gql`
  query {
    auth @client {
      token
    }
  }
`, {
  props: ({ data: { auth } }) => ({
    isAuthenticated: !!auth.token,
  }),
})
@graphql(ROOT_QUERY, {
  options: ({ isAuthenticated }) => ({
    variables: {
      isAuthenticated,
    }
  }),
})
export default class Application extends Component {
  static propTypes = {
    onReady: PropTypes.func,
  };

  static defaultProps = {
    onReady: () => {},
  };

  componentDidMount() {
    this.props.onReady();
  }

  render() {
    return (
      <Navigator />
    );
  }
}
