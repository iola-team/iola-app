import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { isFunction, isUndefined, noop } from 'lodash';

import { withStyleSheet as styleSheet } from 'theme';
import Modal from '../Modal';
import ImageCommentsConnection from './ImageCommentsConnection';

const getModalHeight = () => {
  const { height } = Dimensions.get('window');

  return height * 0.75;
};

@styleSheet('Sparkle.ImageComments', {
  titleRow: {
    flexDirection: 'row',
  },

  title: {
    marginRight: 5,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#45474F',
  },

  count: {
    fontSize: 16,
    color: '#BDC0CB',
  },

  container: {
    minHeight: getModalHeight(),
    paddingVertical: 24,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FB',
  },
})
export default class ImageComments extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]),
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

  static getDerivedStateFromProps(props, state) {
    return { isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible };
  }

  state = {
    isVisible: false,
  };

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  hide = () => {
    const { isVisible } = this.props;

    this.setState({
      isVisible: isUndefined(isVisible) ? false : isVisible,
    });
  };

  onShowImageComments = () => {
    const { isVisible } = this.props;

    this.setState({ isVisible: isUndefined(isVisible) ? true : isVisible });
  };

  renderTitle() {
    const { totalCount, styleSheet: styles } = this.props;

    return (
      <View style={styles.titleRow}>
        <Text style={styles.title}>Comments</Text>
        {totalCount ? <Text style={styles.count}>{totalCount}</Text> : null}
      </View>
    );
  }

  renderModal() {
    const { photoId, styleSheet: styles } = this.props;
    const { isVisible } = this.state;

    return (
      <Modal
        title={this.renderTitle()}
        height={getModalHeight()}
        isVisible={isVisible}
        onDone={this.action('onDone', this.hide)}
        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onCancel={this.action('onCancel', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}
      >
        <View style={styles.container}>
          <ImageCommentsConnection photoId={photoId} height={getModalHeight()} />
        </View>
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {isFunction(children) ? children(this.onShowImageComments) : children}
        {this.renderModal()}
      </Fragment>
    );
  }
}
