import React, { Component } from 'react';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import MyPhotosConnection from './MyPhotosConnection';

@withStyleSheet('iola.MyPhotosScreen', {
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
    zIndex: 2,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
export default class UserPhotos extends Component {
  static navigationOptions = {
    tabBarLabel: 'Photos',
  };

  render() {
    const { navigation, styleSheet: styles, screenProps } = this.props;
    const { contentInset } = navigation.getScreenProps();

    return (
      <Container>
        <MyPhotosConnection
          addButtonStyle={[styles.add, { marginBottom: contentInset.bottom }]}
          contentContainerStyle={styles.list}
          noContentStyle={styles.noContent}

          contentInset={screenProps.contentInset}
        />
      </Container>
    );
  }
}
