import React, { Fragment } from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { range } from 'lodash';

import { getContentDecorator } from 'storybook';
import Placeholder from './Placeholder';

const stories = storiesOf('Components/Placeholder', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Default', () => (
  <Placeholder 
    style={{ height: 200, width: 200, backgroundColor: "#EEEEEE" }}
  />
));

stories.add('Multiple', () => (
  <Fragment>
    {range(10).map((index) => (
      <Placeholder 
        key={index} 
        style={{ alignSelf: 'stretch', height: 30, marginBottom: 15, backgroundColor: "#EEEEEE" }}
      />
    ))}
  </Fragment>
));
