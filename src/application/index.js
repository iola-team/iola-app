import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import gql from 'graphql-tag';

import applicationQuery from './application.graphql';

@graphql(gql`
  query {
    auth @client {
      token
    }
  }
`, {
  props: ({ data: { auth } }) => ({
    isAuthenticated: !!auth,
  }),
})
@graphql(applicationQuery, {
  options: ({ isAuthenticated }) => ({
    variables: {
      isAuthenticated,
    }
  }),
})
export default class Application extends Component {
  render() {
    const { children, data } = this.props;

    console.log(data);

    return (
      children
    );
  }
}
