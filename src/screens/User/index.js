import React from 'react';

// TODO: do not import the component directly
import createHeadingTabsNavigator, { TabBar } from 'components/TabNavigator';
import { ScreenHeader } from 'components';
import UserScreenHead from './UserScreenHead';

const renderHeader = props => <UserScreenHead {...props} />;
const renderTabs = props => <TabBar {...props} />;

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader,
  renderTabs,
  headerShrinkHeight: ScreenHeader.HEIGHT,

  navigationOptions: {
    headerTransparent: true,
  },
});