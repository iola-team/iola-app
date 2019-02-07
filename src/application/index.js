import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { Text } from 'native-base';

import Navigator from 'screens';
import { ROOT_QUERY } from 'graph';

Moment.globalElement = Text;

const AppContext = React.createContext();

export const AppContextConsumer = AppContext.Consumer;

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
    onReady: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onReady();
  }

  render() {
    const { onReset } =  this.props;

    return (
      <AppContext.Provider value={{ onReset }}>
        <Navigator />
      </AppContext.Provider>
    );
  }
}
