import React, { PureComponent, Fragment } from 'react';
import { ScrollView as ScrollViewRN, View } from 'react-native';

import { Consumer } from './Context';

export default class ScrollView extends PureComponent {
  render() {
    const { children, ...props } = this.props;

    return (
      <ScrollViewRN {...props} stickyHeaderIndices={[1]}>
        <Consumer>
          {({ renderHeader }) => renderHeader()}
        </Consumer>

        <Consumer>
          {({ renderTabs }) => renderTabs()}
        </Consumer>

        {children}
      </ScrollViewRN>
    );
  }
}