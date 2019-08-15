import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, Dimensions } from 'react-native';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { Image } from '~components';
import defaultBackground from './defaultBackground.jpg';

@graphql(gql`
  query {
    config {
      backgroundUrl
    }
  }
`)
@styleSheet('Sparkle.Background', {
  background: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
  },

  backgroundShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 46, 0.4)',
  },
})
export default class Background extends Component {
  render() {
    const {
      data: {
        config: {
          backgroundUrl,
        },
      },
      styleSheet: styles,
    } = this.props;
    const source = backgroundUrl ? { uri: backgroundUrl } : defaultBackground;

    return (
      <>
        <Image style={styles.background} source={source} />
        <View style={styles.backgroundShadow} />
      </>
    );
  }
}
