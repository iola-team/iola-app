import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ActionSheetRN from 'react-native-actionsheet';
import {
  View,
  Text,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';

@styleSheet('Sparkle.ActionSheet', {

})
export default class ActionSheet extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    cancelButtonIndex: PropTypes.number,
    destructiveButtonIndex: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    children: () => null,
  };

  styleSheet = null;
  setStyleSheet = (ref) => {
    this.styleSheet = ref;
  };

  show() {
    this.styleSheet.show();
  }

  render() {
    const { styleSheet, children, ...props } = this.props;

    return (
      <Fragment>
        {children(::this.show)}

        <ActionSheetRN
          {...props}
          ref={this.setStyleSheet}
        />
      </Fragment>
    );
  }
}
