import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { BackgroundWithAnimatedLogo } from '~components';

@styleSheet('iola.LaunchError', {
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

  button: {
    marginBottom: 8,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
})
export default class LaunchError extends Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired,
    onChangeWebsiteURL: PropTypes.func.isRequired,
  };

  onTryAgain = async (runAnimation) => {
    const { refetch } = this.props;

    runAnimation(async () => {
      try {
        await refetch();
      } catch (error) {}

      runAnimation();
    });
  };

  render() {
    const { onChangeWebsiteURL, styleSheet: styles } = this.props;

    return (
      <BackgroundWithAnimatedLogo>
        {(runAnimation) => (
          <>
            <Text style={styles.text}>Oops! Something unexpectedly went wrong</Text>
            <Button style={styles.button} onPress={() => this.onTryAgain(runAnimation)} block bordered light>
              <Text>Try Again</Text>
            </Button>
            <Button style={styles.button} onPress={onChangeWebsiteURL} block bordered light>
              <Text>Change Website URL</Text>
            </Button>
          </>
        )}
      </BackgroundWithAnimatedLogo>
    );
  }
}
