import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get } from 'lodash';

import Chat from './Chat';

export default class ChatContainer extends Component {
  static displayName = 'Container(Chat)';

  render() {
    return (
      <Chat {...this.props} />
    );
  }
};
