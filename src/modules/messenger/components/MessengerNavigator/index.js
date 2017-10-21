import React from "react";
import { DrawerNavigator } from 'react-navigation';

import { CHANNELS_ROUTE } from '../../constants';
import ChannelsScreen from '../ChannelsScreen';
import Sidebar from '../Sidebar';

export default DrawerNavigator({
  [CHANNELS_ROUTE]: {
    screen: ChannelsScreen
  }
}, {
  contentComponent: props => <Sidebar {...props} />
});