import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Text, Button } from 'native-base';

import ErrorBoundary from './ErrorBoundary';

const stories = storiesOf('Components/ErrorBoundary', module);

// Decorators
stories.addDecorator(withKnobs);

// Stories
class ThrowError extends Component {
  state = { error: null };

  render() {
    if (this.state.error) {
      throw new Error();
    }

    return (
      <Button
        style={{ alignSelf: 'center', marginTop: 50 }}
        onPress={() => this.setState({ error: true })}
      >
        <Text>Throw error</Text>
      </Button>
    );
  }
}

stories.add('Default', () => (
  <ErrorBoundary
    onRequestRelaunch={action('onRequestRelaunch')}
    onReportPress={action('onReportPress')}
  >
    <ThrowError />
  </ErrorBoundary>
));

stories.add('Handled error', () => (
  <ErrorBoundary
    onRequestRelaunch={action('onRequestRelaunch')}
    onReportPress={action('onReportPress')}
    onError={() => true}
  >
    <ThrowError />
  </ErrorBoundary>
));
