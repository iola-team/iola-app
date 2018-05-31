import React, { Component } from 'react';
import { includes, filter, isFunction, isUndefined, range, memoize, constant, noop, last } from 'lodash';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { TouchableOpacity, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { WheelPicker } from 'react-native-wheel-picker-android';
import moment from 'moment';
import {
  View,
  Text,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme/index';

const getDays = date => range(1, moment(date).daysInMonth() + 1);

const childrenShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
]);

@styleSheet('Sparkle.DatePicker', {
  root: {

  },

  modal: {
    margin: 0,
    justifyContent: "flex-end",
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

  wheel: {
    height: 250,
    flex: 1,
  },

  content: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  }
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
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    value: null,
    maxDate: new Date(),

    isVisible: undefined,

    onChange: noop,
    onHide: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
  }

  state = {
    value: null,
    isVisible: false,
    wheels: {
      year: [],
      month: [],
      day: [],
    },
  };

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
      wheels: {
        year: range(props.minDate.getFullYear(), props.maxDate.getFullYear() + 1),
        month: moment.months(),
        day: getDays(props.value || props.maxDate),
      },
    }
  }

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

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  onChange = part => ({ data, position }) => {
    const { wheels, value } = this.state;
    const { maxDate, onChange } = this.props;
    const prevValue = value || maxDate;
    const newValue = new Date(prevValue.getTime());

    ({
      year: () => newValue.setFullYear(data),
      day: () => newValue.setDate(data),
      month: () => {
        const days = getDays([newValue.getFullYear(), position]);
        const lastDay = last(days);
        if (newValue.getDate() > lastDay) {
          newValue.setDate(lastDay);
        }

        newValue.setMonth(position);

        this.setState({
          wheels: {
            ...wheels,
            day: days,
          }
        });
      },
    })[part]();

    this.setState({
      value: newValue,
    }, () => onChange(newValue));
  }

  renderModal() {
    const { isVisible, wheels, value: stateValue } = this.state;
    const {
      styleSheet: styles,
      label,
      onHide,
      onShow,
      maxDate,
    } = this.props;

    const value = stateValue || maxDate;
    const wheelProps = {
      style: styles.wheel,
      isCurved: false,
      isAtmospheric: true,
      isCurtain: false,
      isCyclic: true,
      selectedItemTextColor: '#585A61',
      renderIndicator: true,
      indicatorColor: '#F2F2F2',
      itemTextSize: PixelRatio.getPixelSizeForLayoutSize(16),
    }

    return (
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        // swipeDirection="down"

        onModalHide={this.action('onHide')}
        onModalShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onBackdropPress={this.hide}
        onBackButtonPress={this.hide}
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
          <View
            padder
            style={styles.content}
          >
            <WheelPicker
              {...wheelProps}
              onItemSelected={this.onChange('month')}
              data={wheels.month}
              selectedItemPosition={value.getMonth()}
            />

            <WheelPicker
              {...wheelProps}
              data={wheels.day}
              onItemSelected={this.onChange('day')}
              selectedItemPosition={wheels.day.indexOf(value.getDate())}
            />

            <WheelPicker
              {...wheelProps}
              onItemSelected={this.onChange('year')}
              data={wheels.year}
              selectedItemPosition={wheels.year.indexOf(value.getFullYear())}
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
