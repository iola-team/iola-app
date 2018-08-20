import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ScrollView, Animated } from 'react-native';
import { Text, View, Content } from 'native-base';

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
