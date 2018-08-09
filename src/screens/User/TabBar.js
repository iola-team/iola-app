import React, { Component } from 'react';
import { View, Button, Text } from 'native-base';

import { USER_FRIENDS, USER_INFO, USER_PHOTOS } from 'screens';

export default class TabBar extends Component {
  render() {
    const {
      navigation,
    } = this.props;

    return (
      <View pointerEvents="box-none" style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button onPress={() => navigation.navigate(USER_PHOTOS)}>
          <Text>Photos</Text>
        </Button>

        <Button onPress={() => navigation.navigate(USER_INFO)}>
          <Text>Info</Text>
        </Button>

        <Button onPress={() => navigation.navigate(USER_FRIENDS)}>
          <Text>Friends</Text>
        </Button>
      </View>
    );
  }
}
