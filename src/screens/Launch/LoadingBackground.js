import React, { Component } from 'react';
import { Container, Text, View } from 'native-base';

import { withStyle } from '~theme';

@withStyle('Sparkle.LoadingBackground', {
  'NativeBase.Container': {
    'NativeBase.ViewNB': {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 320,
      width: '100%',
      paddingHorizontal: '10%',
      backgroundColor: '#5259FF',

      'NativeBase.Text': {
        color: '#FFFFFF',
      },
    },
  },
})
export default class LoadingBackground extends Component {
  render() {
    return (
      <Container>
        <View>
          <Text>Loading...</Text>{/* @TODO: Update this according to design */}
        </View>
      </Container>
    );
  }
}
