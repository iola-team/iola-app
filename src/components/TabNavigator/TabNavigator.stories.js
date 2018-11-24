import React, { Component, PureComponent } from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { View, Text, StyleSheet } from 'react-native';
import { createSwitchNavigator, createAppContainer, withNavigationFocus } from 'react-navigation';
import { range } from 'lodash';

import { getContainerDecorator } from 'storybook';
import createTabNavigator from '.';
import ScrollView from './ScrollView';

const stories = storiesOf('Components/TabNavigator', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

const styles = StyleSheet.create({
  item: {
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },

  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Header = () => (
  <View style={styles.header}>
    <Text>Header</Text>
  </View>
);

const createTab = (backgroundColor, count = 100) => class Tab extends PureComponent {
  
  render() {
    return (
      <ScrollView>
        {range(count).map(item => (
          <View key={item} style={[styles.item, { backgroundColor }]}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
};

// Stories
stories.add('Default', () => {
  const TabNavigator = createTabNavigator({
    Tab1: createTab('#FEFEFE', 100),
    Tab2: createTab('#EEFFFF', 100),
    Tab3: createTab('#EEFFFF', 100),
    Tab4: createTab('#FFEEFF', 100),
    Tab5: createTab('#EEFFEE', 100),
  }, {
    renderHeader: props => <Header {...props} />
  });

  const Story = createAppContainer(TabNavigator);

  return <Story />;
});
