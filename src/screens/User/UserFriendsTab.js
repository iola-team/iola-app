import React, { Component } from 'react';

import { FriendList } from 'components';

export default class UserFriendsTab extends Component {
  static navigationOptions = {
    title: 'Friends',
  };

  render() {
    const { navigation } = this.props;
    const id = navigation.state.params.id;

    return (
      <FriendList userId={id} />
    );
  }
}
