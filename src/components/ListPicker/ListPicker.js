import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { includes, filter, isFunction, isUndefined, without, noop } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Easing,
  Dimensions,
} from 'react-native';
import {
  View,
  Text,
  List,
  ListItem,
  Body,
  Right,
  Left,
  Icon,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import Modal from '../Modal';

const maxHeight = Dimensions.get("window").height * 0.6;
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

@styleSheet('Sparkle.ListPicker', {
  list: {

  },

  item: {
    marginRight: 20,
  },

  itemFirst: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  itemBody: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },

  selectedColor: {
    color: '#5F96F2',
  },

  checkIcon: {
    color: '#C4C7D1',
    fontSize: 20,
    marginRight: 10,
  },
})
export default class ListPicker extends PureComponent {
  static propTypes = {
    value: PropTypes.arrayOf(valueShape),
    options: PropTypes.arrayOf(itemShape).isRequired,
    multiple: PropTypes.bool,

    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    children: childrenShape,

    onChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onItemPress: PropTypes.func,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    isVisible: undefined,
    value: [],
    multiple: false,

    onChange: noop,
    onItemPress: noop,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
    };
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

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  onItemPress = ({ value }) => {
    const { value: values } = this.state;
    const newValues = this.props.multiple
      ? values.includes(value) ? without(values, value) : [...values, value]
      : [value];

    this.setState({
      value: newValues,
    }, this.action('onChange', this.action('onItemPress')));
  };

  renderRow = (item) => {
    const { label, value, selected, first, last } = item;
    const { styleSheet: styles } = this.props;
    const selectedStyle = selected ? styles.selectedColor : null;
    const firstStyle = first ? styles.itemFirst : null;

    return (
      <ListItem
        style={[styles.item, firstStyle]}
        key={value}
        first={first}
        last={last}
        button
        onPress={() => this.onItemPress(item)}
      >
        <Body style={styles.itemBody}>
          <Icon style={[styles.checkIcon, selectedStyle]} name="checkmark" />
          <Text style={selectedStyle}>{label}</Text>
        </Body>
      </ListItem>
    );
  }

  renderModal() {
    const { isVisible, value } = this.state;
    const {
      styleSheet: styles,
      label,
      options,
    } = this.props;

    const items = options.map((option, index) => ({
      ...option,
      selected: includes(value, option.value),
      first: index === 0,
      last: (index + 1) === options.length,
    }));

    const listHeight = Math.min(options.length * 53, maxHeight);

    return (
      <Modal
        height={listHeight}
        isVisible={isVisible}
        title={label}
        onDone={this.action('onDone', this.hide)}
        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onCancel={this.action('onCancel', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}
      >
        <List
          style={styles.list}
          dataArray={items}
          renderRow={this.renderRow}
        />
      </Modal>
    );
  }

  render() {
    const { style, value, options, children } = this.props;
    const selectedOptions = filter(options, option => includes(value, option.value));

    return (
      <View style={style}>
        {
          isFunction(children)
            ? children(this.show, selectedOptions)
            : children
        }
        {this.renderModal()}
      </View>
    );
  }
}
