import { TabRouter, createNavigator } from 'react-navigation';

import TabNavigatorView from './TabNavigatorView';

export default (routes, configs = {}) => {
  const router = TabRouter(routes, configs);

  return createNavigator(TabNavigatorView, router);
};
