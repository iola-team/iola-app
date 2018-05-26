import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { includes, filter, isFunction, isUndefined } from 'lodash';
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
    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    children: childrenShape,
    options: PropTypes.arrayOf(itemShape).isRequired,
    value: PropTypes.arrayOf(valueShape),
    onSelect: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
  }

  static defaultProps = {
    isVisible: undefined,
    value: [],
    onSelect: () => null,
    onHide: () => null,
    onShow: () => null,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
    }
  }

  state = {
    isVisible: false,
  };

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

  onItemPress = (item) => {
    this.props.onSelect(item.value);
  };

  renderRow = (item) => {
    const { label, value, selected } = item;
    const { styleSheet: styles, value: selectedValues } = this.props;

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
    const { isVisible } = this.state;
    const {
      styleSheet: styles,
      label,
      value,
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
