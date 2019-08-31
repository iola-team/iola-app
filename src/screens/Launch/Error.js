import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { BackgroundWithAnimatedLogo, Spinner } from '~components';

@styleSheet('iola.Error', {
  text: {
    maxWidth: 230,
    marginTop: -17,
    marginBottom: 56,
    marginHorizontal: 'auto',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
  },

  tryAgain: {
    marginBottom: 8,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
})
export default class Error extends Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  onTryAgain = () => {
    const { refetch, loading } = this.props;

    if (!loading) refetch();
  };

  render() {
    const { loading, styleSheet: styles } = this.props;

    return (
      <BackgroundWithAnimatedLogo>
        <>
          <Text style={styles.text}>Oops! Something unexpectedly went wrong</Text>
          <Button style={styles.tryAgain} onPress={this.onTryAgain} block bordered light>
            <Text>Try Again</Text>
            {loading && <Spinner />}
          </Button>
          <Button style={styles.tryAgain} onPress={() => null} block bordered light>
            <Text>Change Website URL</Text>
          </Button>
        </>
      </BackgroundWithAnimatedLogo>
    );
  }
}
