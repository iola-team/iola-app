import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
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
  Icon,
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

@styleSheet('Sparkle.ListPicker', {
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

  content: {
    maxHeight: Dimensions.get("window").height * 0.6,
    backgroundColor: '#FFFFFF',
  }
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
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onItemPress: PropTypes.func,
  }

  static defaultProps = {
    isVisible: undefined,
    value: [],
    multiple: false,

    onChange: noop,
    onItemPress: noop,
    onHide: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
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

  action = (handler, preHandler = noop) => () => {
    preHandler();
    this.props[handler](this.state.value);
  };

  onItemPress = ({ value }) => {
    const { value: values } = this.state;
    const newValues = this.props.multiple
      ? values.includes(value) ? without(values, value) : [
          ...values,
          value,
        ]
      : [ value ];

    this.setState({
      value: newValues,
    }, this.action('onChange', this.action('onItemPress')));
  };

  renderRow = (item) => {
    const { label, value, selected } = item;
    const { styleSheet: styles } = this.props;

    return (
      <ListItem
        key={value}
        button
        onPress={() => this.onItemPress(item)}
      >
        <Body>
        <Text>{label}</Text>
        </Body>
        <Right>
          {
            selected && (
              <Icon style={styles.checkIcon} name="checkmark" />
            )
          }
        </Right>
      </ListItem>
    );
  }

  renderModal() {
    const { isVisible, value } = this.state;
    const {
      styleSheet: styles,
      label,
      options,
      onHide,
      onShow,
    } = this.props;

    const items = options.map(option => ({
      ...option,
      selected: includes(value, option.value),
    }));

    return (
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        backdropColor={styles.backdrop.backgroundColor}
        backdropOpacity={styles.backdrop.opacity}
        swipeDirection="down"

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
          <ScrollView style={styles.content}>
            <List
              dataArray={items}
              renderRow={this.renderRow}
            />
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    const { style, styleSheet: styles, value, options, children } = this.props;
    const selectedOptions = filter(options, option => includes(value, option.value))

    return (
      <View style={[styles.root, style]}>
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
