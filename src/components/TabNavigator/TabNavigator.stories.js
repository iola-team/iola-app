import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { View, Text } from 'native-base';
import { createSwitchNavigator } from 'react-navigation';

import { getContainerDecorator } from 'storybook';
import createTabNavigator from '.';

const stories = storiesOf('Components/TabNavigator', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());


const Tab1 = () => (
  <View>
    <Text>Tab 1</Text>
  </View>
);

const createNavigationStory = (tabs) => {
  const Tabs = createTabNavigator(tabs);
  const Navigator = createSwitchNavigator({ Tabs });

  return <Navigator />;
};

// Stories
stories.add('Default', () => createNavigationStory({
  Tab1
}));
