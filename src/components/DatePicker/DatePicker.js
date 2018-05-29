import React, { Component } from 'react';
import { includes, filter, isFunction, isUndefined, range } from 'lodash';
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
    height: 200,
    flex: 1,
  },

  content: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  }
})
export default class DatePicker extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    minDate: PropTypes.instanceOf(Date).isRequired,
    maxDate: PropTypes.instanceOf(Date),
  }

  static defaultProps = {
    isVisible: undefined,
    onChange: () => null,
    onHide: () => null,
    onShow: () => null,
    maxDate: new Date(),
  }

  state = {
    isVisible: false,
    value: new Date(),
    wheels: {
      year: [],
      month: [],
      day: [],
    },
  };

  static getDerivedStateFromProps(props, state) {
    return {
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
      wheels: {
        year: range(props.minDate.getFullYear(), props.maxDate.getFullYear()),
        month: moment.months(),
        day: getDays(state.value),
      },
    }
  }

  show = () => {
    this.setState({
      isVisible: true,
    });
  };

  hide = () => {
    this.setState({
      isVisible: false,
    });
  };

  onSelect = part => ({ data, position }) => {
    const { value, wheels } = this.state;
    const newValue = new Date(value.getTime());

    const setter = ({
      year: 'setFullYear',
      month: 'setMonth',
      day: 'setDate',
    })[part];

    newValue[setter](part === 'month' ? position : data);

    this.setState({
      value: newValue,
      wheels: {
        ...wheels,
        day: getDays(newValue),
      },
    });
  }

  renderModal() {
    const { isVisible, wheels } = this.state;
    const {
      styleSheet: styles,
      label,
      onHide,
      onShow,
    } = this.props;

    const wheelProps = {
      style: styles.wheel,
      isCurved: false,
      isAtmospheric: true,
      isCurtain: false,
      isCyclic: true,
      selectedItemTextColor: '#585A61',
      onItemSelected: this.onSelect('month'),
      renderIndicator: true,
      indicatorColor: '#EEEEEE',
      itemTextSize: PixelRatio.getPixelSizeForLayoutSize(16),
    }

    return (
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        // swipeDirection="down"

        onModalHide={onHide}
        onModalShow={onShow}
        onSwipe={this.hide}
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
            <TouchableOpacity onPress={this.hide}>
              <Text style={styles.headerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View
            padder
            style={styles.content}
          >
            <WheelPicker
              {...wheelProps}
              data={wheels.month}
            />

            <WheelPicker
              {...wheelProps}
              data={wheels.day}
            />

            <WheelPicker
              data={wheels.year}
              {...wheelProps}
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { style, styleSheet: styles, children } = this.props;

    return (
      <View style={[styles.root, style]}>
        {
          isFunction(children)
            ? children(this.show)
            : children
        }
        {this.renderModal()}
      </View>
    );
  }
}
