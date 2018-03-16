import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import gql from 'graphql-tag';
import SplashScreen from "react-native-splash-screen"
import Moment from 'react-moment';
import { Text } from 'native-base';

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
    isAuthenticated: !!auth,
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
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const { children, data } = this.props;

    return (
      children
    );
  }
}
