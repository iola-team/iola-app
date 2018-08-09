import React, { Component, Fragment } from 'react';
import { ScrollView, Animated } from 'react-native';
import { Text, View, Content } from 'native-base';

import Tab from './Tab';

export default class UserPhotosTab extends Component {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    return (
      <Tab {...this.props}>
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
        <View style={{ height: 100, backgroundColor: '#CCCCCC', margin: 5 }} />
      </Tab>
    );
  }
}
