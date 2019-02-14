import React, { Component } from 'react';
import { View } from 'react-native';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';

import { withStyle } from 'theme';
import ImageFit from '../ImageFit';
import Shadow from '../Shadow';

const contentFragment = gql`
  fragment MessageContentImage_content on MessageContent {
    image
  }
`;

@withStyle('Sparkle.MessageContentImage')
export default class MessageContentImage extends Component {
  static fragments = {
    content: contentFragment,
  };

  static propTypes = {
    content: fragmentProp(contentFragment).isRequired,
  };

  render() {
    const { content: { image }, style } = this.props;

    return (
      <View style={style}>
        <ImageFit url={image} maxHeight={170} maxWidth={200} />
        <Shadow
          style={{
            width: '100%',
            shadowSpread: 60,
            shadowColors: ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)'],
          }}
          bottom={false}
          top
        />
      </View>
    );
  }
}
