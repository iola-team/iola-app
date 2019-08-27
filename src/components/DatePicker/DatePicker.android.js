import React, { Component } from 'react';
import { isFunction, isUndefined, range, noop, last } from 'lodash';
import PropTypes from 'prop-types';
import { WheelPicker } from 'react-native-wheel-picker-android';
import moment from 'moment';
import { PixelRatio } from 'react-native';
import { View, Text } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Backdrop from '../Backdrop';
import TouchableOpacity from '../TouchableOpacity';

const getDays = date => range(1, moment(date).daysInMonth() + 1);

const childrenShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
]);

/**
 * TODO: Extract common logic for IOS and Android to a separate file
 */
@styleSheet('iola.DatePicker', {
  wheel: {
    height: 250,
    flex: 1,
  },

  wheels: {
    flexDirection: 'row',
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
    wheels: {
      year: [],
      month: [],
      day: [],
    },
  };

  static getDerivedStateFromProps(props, state) {
    const value = props.value || props.maxDate;

    return {
      value: state.isVisible ? state.value : value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
      wheels: {
        year: range(props.minDate.getFullYear(), props.maxDate.getFullYear() + 1),
        month: moment.months(),
        day: getDays(value),
      },
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

  onChange = part => ({ data, position }) => {
    const { wheels, value } = this.state;
    const { onChange } = this.props;
    const newValue = new Date(value.getTime());

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
    const { styleSheet: styles, label } = this.props;

    const value = stateValue;
    const wheelProps = {
      style: styles.wheel,
      isCurved: false,
      isAtmospheric: true,
      isCurtain: false,
      isCyclic: true,
      selectedItemTextColor: '#585A61',
      renderIndicator: true,
      indicatorColor: '#F5F5F5',
      itemTextSize: PixelRatio.getPixelSizeForLayoutSize(16),
    };

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
