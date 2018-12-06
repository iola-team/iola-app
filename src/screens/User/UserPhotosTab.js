import React, { Component } from 'react';

import { UserPhotos } from 'components';

export default class UserPhotosTab extends Component {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation } = this.props;
    const id = navigation.state.params.id;

    return (
      <UserPhotos userId={id} />
    );
  }
}
