import React, { Component } from 'react';

import Chat from './Chat';

export default class ChatContainer extends Component {
  static displayName = 'Container(Chat)';

  render() {
    return (
      <Chat {...this.props} />
    );
  }
};
