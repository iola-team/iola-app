import React, { PureComponent } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PropTypes from 'prop-types';
import { noop, clamp } from 'lodash';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import { withStyleSheet as styleSheet } from '~theme';
import BackdropHeader from './BackdropHeader';
import Overlay from '../Overlay';
import KeyboardAvoidingView from '../KeyboardAvoidingView';

const windowHeight = Dimensions.get('window').height;

@styleSheet('iola.Backdrop', {
  body: {
    marginTop: 'auto',
  },

  header: {
    height: 70,
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

    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onRequestClose: PropTypes.func,

    headerRight: PropTypes.element,
    headerLeft: PropTypes.element,
  };

  static defaultProps = {
    height: windowHeight * 0.6,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onRequestClose: noop,

    headerRight: null,
    headerLeft: null,
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

    const [, maxY] = this.getScreenBounds();
    this.dragY = new Animated.Value(0);
    this.offsetY = new Animated.Value(maxY);
    this.translateY = Animated.add(this.offsetY, this.dragY);

    this.onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this.dragY } }],
      { useNativeDriver: true }
    );
  }

  onHandlerStateChange = ({ nativeEvent }) => {
    const { onSwipe } = this.props;
    const { translationY, velocityY } = nativeEvent;
    const offsetY = clamp(translationY, ...this.getScreenBounds());
    const velocity = velocityY / 1000;

    if (nativeEvent.oldState === State.ACTIVE) { // On release
      this.dragY.setValue(0);
      this.offsetY.setValue(offsetY);

      if (offsetY > this.getHeight() * 0.3) {
        onSwipe();
      }

      requestAnimationFrame(() => {
        const { isVisible } = this.props;

        if (isVisible) {
          this.rollbackSwipe(velocity);
        }
      });
    }
  };

  rollbackSwipe = (velocity) =>  Animated.spring(this.offsetY, {
    velocity,
    toValue: 0,
    bounciness: 0,
    useNativeDriver: true,
  }).start();

  onDismiss = () => {
    const { onDismiss } = this.props;

    this.offsetY.setValue(this.getHeight());
    this.setState({ active: false }, onDismiss);
  };

  animateTo = (toValue, onDone) => Animated.timing(this.offsetY, {
    toValue,
    duration: 300,
    useNativeDriver: true,
  }).start(onDone);

  hide = () => this.animateTo(this.getHeight(), this.onDismiss);
  show = () => this.animateTo(0, this.props.onShow);

  getHeight() {
    const { styleSheet, height } = this.props;

    return height + styleSheet.header.height;
  }

  getScreenBounds() {
    const modalHeight = this.getHeight();
    const statusBarHeight = getStatusBarHeight(true);

    return [
      modalHeight - windowHeight + statusBarHeight,
      modalHeight,
    ];
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
      headerLeft,
      headerRight,

      onRequestClose,
    } = this.props;

    const { active } = this.state;
    const modalHeight = this.getHeight();
    const backdropStyle = {
      opacity: this.translateY.interpolate({
        inputRange: [0, modalHeight],
        outputRange: [styles.backdrop.opacity, 0],
        extrapolate: 'clamp',
      }),
    };

    const screenBounds = this.getScreenBounds();
    const bodyStyle = {
      transform: [
        {
          translateY: this.translateY.interpolate({
            inputRange: screenBounds,
            outputRange: screenBounds,
            extrapolate: 'clamp',
          }),
        }
      ],
    };

    return (
      <Overlay visible={active} onRequestClose={onRequestClose}>
        {/* TODO: Improve keyboard avoiding logic for better UX */}
        <KeyboardAvoidingView>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
          <Animated.View style={[styles.body, bodyStyle]}>
            <View style={styles.bodyBackground} />

            <PanGestureHandler
              onGestureEvent={this.onGestureEvent}
              onHandlerStateChange={this.onHandlerStateChange}
            >
              <Animated.View>
                <BackdropHeader
                  style={styles.header}
                  title={title}
                  leftElement={headerLeft}
                  rightElement={headerRight}
                />
              </Animated.View>
            </PanGestureHandler>

            <View style={{ height }}>
              {children}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Overlay>
    );
  }
}
