import React, { Component } from 'react';
import { isFunction, isUndefined, noop } from 'lodash';
import PropTypes from 'prop-types';
import { DatePickerIOS } from 'react-native';
import { View, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Backdrop from '../Backdrop';
import TouchableOpacity from '../TouchableOpacity';

const childrenShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
]);

/**
 * TODO: Extract common logic for IOS and Android to a separate file
 */
@styleSheet('Sparkle.DatePicker', {
  wheel: {
    height: 230,
    flex: 1,
  },

  wheels: {
    
  },
})
export default class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date).isRequired,
    maxDate: PropTypes.instanceOf(Date),

    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    children: childrenShape,

    onChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    value: null,
    maxDate: new Date(),

    isVisible: undefined,

    onChange: noop,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  }

  state = {
    value: null,
    isVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    const value = props.value || props.maxDate;

    return {
      value: state.isVisible ? state.value : value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
    };
  }

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  onChange = (value) => {
    const { onChange } = this.props;

    this.setState({ value }, () => onChange(value));
  }

  renderModal() {
    const { isVisible, value } = this.state;
    const { styleSheet: styles, minDate, maxDate, label } = this.props;

    return (
      <Backdrop
        height={styles.wheel.height}
        isVisible={isVisible}
        title={label}

        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}

        headerLeft={(
          <TouchableOpacity cancel onPress={this.action('onCancel', this.hide)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}

        headerRight={(
          <TouchableOpacity onPress={this.action('onDone', this.hide)}>
            <Text>Done</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.wheels} padderHorizontal>
          <DatePickerIOS
            style={styles.wheel}
            mode="date"
            date={value}
            minimumDate={minDate}
            maximumDate={maxDate}

            onDateChange={this.onChange}
          />
        </View>
      </Backdrop>
    );
  }

  render() {
    const { style, value, children } = this.props;

    return (
      <View style={style}>
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
