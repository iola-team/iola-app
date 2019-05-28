import React, { forwardRef } from 'react';
import { SectionList } from 'react-native';

import { renderScrollComponent } from './ScrollView';

export default forwardRef((props, ref) => (
  <SectionList
    ref={ref}
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
));