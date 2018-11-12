import React, { Component } from 'react';

import { PhotoList } from 'components';
import Tab from './Tab';

export default class UserPhotosTab extends Component {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation, ...props } = this.props;
    const id = navigation.state.params.id;

    return (
      <Tab
        {...props}
        headerStyles={{ marginBottom: 28 }}
        columnWrapperStyle={{ paddingHorizontal: 20 }}
        scrollComponent={PhotoList}
        userId={id}
      />
    );
  }
}
