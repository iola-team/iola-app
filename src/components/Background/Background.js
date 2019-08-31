import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, Dimensions } from 'react-native';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import defaultBackgroundImage from './defaultBackground.jpg';
import Image from '../Image';

@graphql(gql`
  query {
    config {
      backgroundUrl
    }
  }
`, {
  options: {
    fetchPolicy: 'cache-first',
  },
})
@styleSheet('iola.Background', {
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
    const { data, styleSheet: styles } = this.props;
    const backgroundUrl = data?.config.backgroundUrl;
    const source = backgroundUrl ? { uri: backgroundUrl } : defaultBackgroundImage;

    return (
      <>
        <Image style={styles.background} source={source} />
        <View style={styles.backgroundShadow} />
      </>
    );
  }
}
