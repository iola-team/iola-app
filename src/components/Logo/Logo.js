import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { Image } from '~components';
import logoImage from './logo.png';

@graphql(gql`
  query {
    config {
      logoUrl
    }
  }
`)
@styleSheet('Sparkle.Logo', {
  logo: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    marginTop: 34,
    marginBottom: 18,
    borderRadius: 8,
  },
})
export default class Logo extends Component {
  render() {
    const {
      data: {
        config: {
          logoUrl,
        },
      },
      styleSheet: styles,
    } = this.props;
    const source = logoUrl ? { uri: logoUrl } : logoImage;

    return <Image style={styles.logo} source={source} />;
  }
}
