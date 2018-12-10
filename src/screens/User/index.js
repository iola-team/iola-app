import React from 'react';
import { View } from 'native-base';

// TODO: do not import the component directly
import createHeadingTabsNavigator, { TabBar } from 'components/TabNavigator';
import UserScreenHead from './UserScreenHead';

const renderHeader = props => <UserScreenHead {...props} />;
const renderTabs = props => (
  <View highlight>
    <TabBar {...props} />
  </View>
);

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader,
  renderTabs,
});