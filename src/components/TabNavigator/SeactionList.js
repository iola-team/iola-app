import React from 'react';
import { SectionList } from 'react-native';

import { renderScrollComponent } from './ScrollView';

export default props => (
  <SectionList
    {...props}

    renderScrollComponent={renderScrollComponent}
  />
);