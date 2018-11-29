import React from 'react';
import { FlatList } from 'react-native';

import ScrollView from './ScrollView';

const renderScrollComponent = scrollProps => <ScrollView {...scrollProps} />;
export default props => (
  <FlatList
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
);