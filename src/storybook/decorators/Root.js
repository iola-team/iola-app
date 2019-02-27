import React from 'react';

import { Root } from '~components';

export default () => (story) => (
  <Root>
    {story()}
  </Root>
);
