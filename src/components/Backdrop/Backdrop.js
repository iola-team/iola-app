import React, { PureComponent } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { StyleSheet, Dimensions, Modal, Animated, PanResponder } from 'react-native';
import { View } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import BackdropHeader from './BackdropHeader';

const windowHeight = Dimensions.get('window').height;

@styleSheet('Sparkle.Backdrop', {
  root: {
    flex: 1,
  },

  body: {
    marginTop: 'auto',
  },

  header: {
    height: 76,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,

    opacity: 0.8,
    backgroundColor: '#85878F',
  },

  bodyBackground: {
    ...StyleSheet.absoluteFillObject,

    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: '#FFFFFF',
    height: windowHeight * 2,
  }
})
export default class Backdrop extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    children: PropTypes.element.isRequired,
    height: PropTypes.number,
    footer: PropTypes.element,

    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    height: windowHeight * 0.6,
    footer: null,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  };

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      active: state.active || props.isVisible,
    };
  }

  state = {
    active: false,
  };

  constructor(...args) {
    super(...args);

    const modalHeight = this.getHeight();
    const modalTop = windowHeight - getStatusBarHeight() - modalHeight;

    this.animatedValue = new Animated.Value(modalHeight);
    const animatedEvent = Animated.event([null, { dy: this.animatedValue }]);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: ({ nativeEvent: { pageY } }) => (
        (pageY - modalTop) < this.props.styleSheet.header.height
      ),
      onPanResponderGrant: () => {
        this.animatedValue.setOffset(0);
        this.animatedValue.setValue(0);
      },
      onPanResponderMove: (event, gestureState) => {
        if (modalTop + gestureState.dy > 0) {
          animatedEvent(event, gestureState);
        }
      },
      onPanResponderRelease: (event, { dy }) => {
        const { onSwipe } = this.props;
        this.animatedValue.flattenOffset();

        if (dy > this.getHeight() * 0.3) {
          onSwipe();
        }

        requestAnimationFrame(this.afterResponderRelease);
      },
    });
  }

  afterResponderRelease = () => {
    const { isVisible } = this.props;

    if (isVisible) {
      this.animateTo(0);
    }
  };

  animateTo = (toValue, onDone) => Animated.timing(this.animatedValue, {
    toValue,
    duration: 300,
    useNativeDriver: true,
  }).start(onDone);

  hide = () => {
    const { onDismiss } = this.props;

    this.animateTo(this.getHeight(), onDismiss);
  };

  show = () => {
    const { onShow } = this.props;

    this.animateTo(0, onShow);
  };

  getHeight() {
    const { styleSheet, height } = this.props;

    return height + styleSheet.header.height;
  }

  componentDidUpdate({ isVisible }) {
    if (!isVisible && this.props.isVisible) {
      this.show();
    }

    if (isVisible && !this.props.isVisible) {
      this.hide();
    }
  }

  render() {
    const {
      styleSheet: styles,
      title,
      children,
      height,
      footer,
      onDone,
      onCancel,
      onRequestClose,
    } = this.props;

    const { active } = this.state;
    const modalHeight = this.getHeight();
    const backdropStyle = {
      opacity: this.animatedValue.interpolate({
        inputRange: [0, modalHeight],
        outputRange: [styles.backdrop.opacity, 0],
        extrapolate: 'clamp',
      }),
    };

    const rootStyle = {
      transform: [
        {
          translateY: this.animatedValue,
        },
      ],
    };

    return (
      <Modal
        transparent
        visible={active}
        onRequestClose={onRequestClose}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]} />

        <View style={styles.root} {...this.panResponder.panHandlers}>
          <Animated.View style={[styles.body, rootStyle]}>
            <Animated.View style={styles.bodyBackground} />

            <BackdropHeader
              style={styles.header}
              title={title}
              onCancel={onCancel}
              onDone={onDone}
            />

            <View style={{ height }}>
              {children}
            </View>

            {footer}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
