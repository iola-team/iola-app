import React from 'react';
import { FlatList } from 'react-native';

import { renderScrollComponent } from './ScrollView';

export default props => (
  <FlatList
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
);