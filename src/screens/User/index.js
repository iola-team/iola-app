import React from 'react';
import { View } from 'native-base';

// TODO: do not import the component directly
import createHeadingTabsNavigator, { TabBar } from 'components/TabNavigator';
import UserInfoTab from './UserInfoTab';
import UserFriendsTab from './UserFriendsTab';
import UserPhotosTab from './UserPhotosTab';
import UserScreenHead from './UserScreenHead';

const renderHeader = props => <UserScreenHead {...props} />;
const renderTabs = props => (
  <View highlight>
    <TabBar {...props} />
  </View>
);

export {
  UserInfoTab,
  UserFriendsTab,
  UserPhotosTab,
};

export default (routes, config = {}) => createHeadingTabsNavigator(routes, {
  ...config,
  renderHeader,
  renderTabs,
});