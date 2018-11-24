import React, { PureComponent } from 'react';
import { ScrollView as ScrollViewRN } from 'react-native';

import { TabBar, Header } from './SceneView';

export default class ScrollView extends PureComponent {
  render() {
    const { children, ...props } = this.props;

    return (
      <ScrollViewRN {...props} stickyHeaderIndices={[1]}>
        <Header />
        <TabBar />

        {children}
      </ScrollViewRN>
    );
  }
}