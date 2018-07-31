import React, { Component } from 'react';
import { isFunction, isUndefined, noop } from 'lodash';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { View, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import Modal from '../Modal';

const childrenShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
]);

@styleSheet('Sparkle.ImageComments', {

})
export default class ImageComments extends Component {
  static propTypes = {
    children: childrenShape,
    isVisible: PropTypes.bool,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    isVisible: undefined,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  };

  state = {
    isVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    return { isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible };
  }

  onShowImageComments = () => {
    const { isVisible } = this.props;

    this.setState({ isVisible: isUndefined(isVisible) ? true : isVisible });
  };

  hide = () => {
    const { isVisible } = this.props;

    this.setState({
      isVisible: isUndefined(isVisible) ? false : isVisible,
    });
  };

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  renderModal() {
    const { isVisible } = this.state;
    const { height } = Dimensions.get('window');

    return (
      <Modal
        height={height * 0.75}
        isVisible={isVisible}
        title="Comments"
        onDone={this.action('onDone', this.hide)}
        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onCancel={this.action('onCancel', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}
      >
        <View onStartShouldSetResponder={() => true} padderHorizontal>
          <Text>Comments will be here</Text>
        </View>
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <View>
        {isFunction(children) ? children(this.onShowImageComments) : children}
        {this.renderModal()}
      </View>
    );
  }
}
