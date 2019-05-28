import React, { forwardRef } from 'react';
import { FlatList } from 'react-native';

import { renderScrollComponent } from './ScrollView';

export default forwardRef((props, ref) => (
  <FlatList
    ref={ref}
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
));