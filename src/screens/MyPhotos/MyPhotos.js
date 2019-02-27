import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from '~theme';
import MyPhotosConnection from './MyPhotosConnection';
import TabBarLabel from './TabBarLabel';

@withStyleSheet('Sparkle.MyPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  add: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    elevation: 5,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
@withNavigationFocus
export default class UserPhotos extends Component {
  static navigationOptions = {
    tabBarLabel: <TabBarLabel />,
  };

  shouldComponentUpdate({ isFocused }) {
    return isFocused;
  }

  render() {
    const { navigation, styleSheet: styles } = this.props;

    return (
      <MyPhotosConnection
        addButtonStyle={styles.add}
        contentContainerStyle={styles.list}
        noContentStyle={styles.noContent}
      />
    );
  }
}
