import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ModalRN from 'react-native-modal';
import { noop } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { View, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';
import { getInAnimation, getOutAnimation } from './animations'

const maxHeight = Dimensions.get("window").height * 0.6;

@styleSheet('Sparkle.Modal', {
  root: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },

  modal: {
    margin: 0,
    padding: 0,
    justifyContent: "flex-end",
  },

  backdrop: {
    opacity: 0.8,
    backgroundColor: '#85878F',
  },

  header: {
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerDoneText: {
    color: '#5F96F2',
  },

  headerCancelText: {
    color: '#BDC0CB',
  },

  content: {

  }
})
export default class Modal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    height: PropTypes.number,

    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    height: maxHeight,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  }

  animations = {
    show: null,
    hide: null,
  };

  render() {
    const {
      styleSheet: styles,
      title,
      isVisible,
      children,
      height,

      onDismiss,
      onShow,
      onSwipe,
      onDone,
      onCancel,
      onRequestClose,
    } = this.props;

    const modalHeight = height + styles.header.height;

    return (
      <ModalRN
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        animationOut={getOutAnimation(modalHeight)}
        animationIn={getInAnimation(modalHeight)}
        swipeDirection="down"

        onModalHide={onDismiss}
        onModalShow={onShow}
        onSwipe={onSwipe}
        onBackdropPress={onRequestClose}
        onBackButtonPress={onRequestClose}
      >
        <View style={styles.root}>
          <View
            style={styles.header}
            horizontalPadder
          >
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.headerCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text>{title}</Text>
            <TouchableOpacity onPress={onDone}>
              <Text style={styles.headerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={[styles.content, { height }]}>
            {children}
          </ScrollView>
        </View>
      </ModalRN>
    );
  }
}
