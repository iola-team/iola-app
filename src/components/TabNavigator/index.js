import { createTabNavigator } from 'react-navigation-tabs';

import TabNavigatorView from './TabNavigatorView';
import { NoContent } from './SceneView';
import ScrollView from './ScrollView';
import FlatList from './FlatList';
import SeactionList from './SeactionList';
import TabBar from '../TabBar';

const TabNavigatorFactory = createTabNavigator(TabNavigatorView);

export {
  TabNavigatorFactory as default,
  ScrollView,
  FlatList,
  SeactionList,
  TabBar,
  NoContent,
};
