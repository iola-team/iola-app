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

  headerControl: {
    width: 50,
  },

  cancel: {
    fontSize: 14,
    color: '#BDC0CB',
  },

  title: {
    fontSize: 16,
  },

  done: {
    textAlign: 'right',
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
    noScrollViewForContent: PropTypes.bool,

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
    noScrollViewForContent: false,
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
      noScrollViewForContent,

      onDismiss,
      onShow,
      onSwipe,
      onDone,
      onCancel,
      onRequestClose,
    } = this.props;

    const modalHeight = height + styles.header.height;
    const ContentWrapper = noScrollViewForContent ? View : ScrollView;

    return (
      <ModalRN
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        animationOut={getOutAnimation(modalHeight)}
        animationIn={getInAnimation(modalHeight)}
        // swipeDirection="down" // @TODO: try to do "swipe to close" just with backdrop header

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
              <TouchableOpacity style={styles.headerControl} onPress={onCancel}>
                {onCancel !== noop && <Text style={styles.cancel}>Cancel</Text>}
              </TouchableOpacity>
              {isString(title) ? <Text style={styles.title}>{title}</Text> : title}
              <TouchableOpacity style={styles.headerControl} onPress={onDone}>
                <Text style={styles.done}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ContentWrapper style={{ height }}>
            {children}
          </ContentWrapper>
          {footer}
        </View>
      </ModalRN>
    );
  }
}
