import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ModalRN from 'react-native-modal';
import { noop, isString } from 'lodash';
import { TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { View, Text } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';
import { getInAnimation, getOutAnimation } from './animations';

const maxHeight = Dimensions.get('window').height * 0.6;

@styleSheet('Sparkle.Modal', {
  root: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },

  modal: {
    margin: 0,
    padding: 0,
    justifyContent: 'flex-end',
  },

  backdrop: {
    opacity: 0.8,
    backgroundColor: '#85878F',
  },

  header: {
    height: 60,
  },

  topRectangle: {
    width: 64,
    height: 4,
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#E1E3E8',
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },

  cancel: {
    fontSize: 14,
    color: '#BDC0CB',
  },

  title: {
    fontSize: 16,
  },

  done: {
    fontSize: 14,
    color: '#5F96F2',
  },
})
export default class Modal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    children: PropTypes.element.isRequired,
    height: PropTypes.number,
    footer: PropTypes.object,

    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    height: maxHeight,
    footer: null,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  };

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
      footer,

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

        backdropTransitionInTiming={500}

        onModalHide={onDismiss}
        onModalShow={onShow}
        onSwipe={onSwipe}
        onBackdropPress={onRequestClose}
        onBackButtonPress={onRequestClose}
      >
        <View style={styles.root}>
          <View style={styles.header} horizontalPadder>
            <View style={styles.topRectangle} />
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onCancel}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              {isString(title) ? <Text style={styles.title}>{title}</Text> : title}
              <TouchableOpacity onPress={onDone}>
                <Text style={styles.done}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ height }}>
            {children}
          </ScrollView>
          {footer}
        </View>
      </ModalRN>
    );
  }
}
