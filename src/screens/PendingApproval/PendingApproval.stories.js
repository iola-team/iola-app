import React from 'react';
import { storiesOf } from '@storybook/react-native';

import PendingApproval from './PendingApproval';

const stories = storiesOf('Screens/PendingApproval', module);

// Stories
stories.add('Screen', () => <PendingApproval />);
