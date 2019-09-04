import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet as styleSheet } from '~theme';
import { Image } from '~components';
import defaultLogoImage from './defaultLogo.png';

@graphql(gql`
  query {
    config {
      logoUrl
    }
  }
`, {
  options: {
    fetchPolicy: 'cache-first',
  },
})
@styleSheet('iola.Logo', {
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
    const { data, styleSheet: styles } = this.props;
    const logoUrl = data?.config.logoUrl;
    const source = logoUrl ? { uri: logoUrl } : defaultLogoImage;

    return <Image style={styles.logo} source={source} />;
  }
}
