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
import FlatList from './FlatList';

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
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Header = () => (
  <View style={styles.header}>
    <Text>Header</Text>
  </View>
);

const createScrollViewTab = (backgroundColor, count = 100) => class Tab extends PureComponent {
  
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

const createFlatListTab = (backgroundColor, count = 100) => class Tab extends PureComponent {
  renderItem = ({ item }) => (
    <View key={item.key} style={[styles.item, { backgroundColor }]}>
      <Text>{item.key}</Text>
    </View>
  );

  render() {
    const data = range(count).map(i => ({ key: i.toString() }));

    return (
      <FlatList data={data} renderItem={this.renderItem} />
    );
  }
};

// Stories
stories.add('Default', () => {
  const TabNavigator = createTabNavigator({
    ScrollView: createScrollViewTab('#FEFEFE', 100),
    FlatList: createFlatListTab('#EEEEFF', 100),
  }, {
    renderHeader: props => <Header {...props} />
  });

  const Story = createAppContainer(TabNavigator);

  return <Story />;
});
