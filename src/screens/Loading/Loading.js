import React, { Component } from 'react';
import { Container, View } from 'native-base';

import { withStyle } from '~theme';
import { Spinner } from '~components';

@withStyle('iola.LoadingScreen', {
  'NativeBase.Container': {
    'NativeBase.ViewNB': {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 320,
      width: '100%',
      paddingHorizontal: '10%',
      backgroundColor: '#FFFFFF',
    },
  },
})
export default class LoadingScreen extends Component {
  render() {
    return (
      <Container>
        <View>
          <Spinner size="large" />
        </View>
      </Container>
    );
  }
}
