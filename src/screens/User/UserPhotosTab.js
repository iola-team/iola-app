import React, { Component } from 'react';

import { PhotoList } from 'components';

export default class UserPhotosTab extends Component {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation } = this.props;
    const id = navigation.state.params.id;

    return (
      <PhotoList userId={id} />
    );
  }
}
