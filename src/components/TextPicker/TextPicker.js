import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { includes, filter, isFunction, isUndefined, without, noop } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import {
  View,
  Text,
  Textarea,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';

const valueShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

const childrenShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
]);


const itemShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: valueShape,
});

@styleSheet('Sparkle.TextPicker', {
  root: {

  },

  modal: {
    margin: 0,
    justifyContent: "flex-start",
  },

  backdrop: {
    opacity: 0.8,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#BDC0CB',
  },

  headerButtonText: {
    color: '#5F96F2',
    fontWeight: 'bold',
  },

  checkIcon: {
    color: '#5F96F2',
  },

  content: {
    maxHeight: Dimensions.get("window").height * 0.6,
    backgroundColor: '#FFFFFF',
  }
})
export default class TextPicker extends PureComponent {
  static propTypes = {
    value: PropTypes.string,

    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    children: childrenShape,

    onChange: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    isVisible: undefined,
    value: '',

    onChange: noop,
    onHide: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onClose: noop,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
    }
  }

  state = {
    isVisible: false,
    value: null,
  };

  show = () => {
    const { value, isVisible } = this.props;

    this.setState({
      value,
      isVisible: isUndefined(isVisible) ? true : isVisible,
    });
  };

  hide = () => {
    const { isVisible } = this.props;

    this.setState({
      isVisible: isUndefined(isVisible) ? false : isVisible,
    });
  };

  onKeyboardHide = () => this.action('onClose', this.hide)();

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  onChange = (value) => {
    this.setState({
      value,
    }, this.action('onChange'));
  };

  componentDidMount() {
    Keyboard.addListener('keyboardDidHide', this.onKeyboardHide);
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide', this.onKeyboardHide);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.isVisible && prevState.isVisible) { // Dismiss
      Keyboard.dismiss();
    }
  }

  renderModal() {
    const { isVisible, value } = this.state;
    const {
      styleSheet: styles,
      label,
      placeholder,
    } = this.props;

    return (
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        swipeDirection="down"
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}

        onModalHide={this.action('onHide')}
        onModalShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onBackdropPress={this.action('onClose', this.hide)}
        onBackButtonPress={this.action('onClose', this.hide)}
      >
        <View>
          <View
            style={styles.header}
            highlight
            padder
          >
            <Text>{label}</Text>
            <TouchableOpacity onPress={this.action('onDone', this.hide)}>
              <Text style={styles.headerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Textarea
              value={value}
              onChangeText={this.onChange}
              autoFocus
              rowSpan={12}
              placeholder={placeholder}
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { style, styleSheet: styles, value, children } = this.props;

    return (
      <View style={[styles.root, style]}>
        {
          isFunction(children)
            ? children(this.show, value)
            : children
        }
        {this.renderModal()}
      </View>
    );
  }
}
