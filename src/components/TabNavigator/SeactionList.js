import React from 'react';
import { SectionList } from 'react-native';

import ScrollView from './ScrollView';

const renderScrollComponent = scrollProps => <ScrollView {...scrollProps} />;
export default props => (
  <SectionList
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
);