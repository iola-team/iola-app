import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { includes, filter, isFunction, isUndefined, without, noop } from 'lodash';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Text, List, ListItem, Body } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import Backdrop from '../Backdrop';
import Icon from '../Icon';
import TouchableOpacity from '../TouchableOpacity';

const maxHeight = Dimensions.get('window').height * 0.6;
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
    marginTop: 4,
    marginRight: 10,
    fontSize: 12,
    color: '#C4C7D1',
  },
})
export default class ListPicker extends PureComponent {
  static propTypes = {
    value: PropTypes.arrayOf(valueShape),
    options: PropTypes.arrayOf(itemShape).isRequired,
    multiple: PropTypes.bool,

    isVisible: PropTypes.bool,
    label: PropTypes.string.isRequired,
    doneLabel: PropTypes.string,
    children: childrenShape,
    renderHeaderRight: PropTypes.func,
    renderHeaderLeft: PropTypes.func,

    onChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onSwipe: PropTypes.func,
    onDone: PropTypes.func,
    onCancel: PropTypes.func,
    onItemPress: PropTypes.func,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    isVisible: undefined,
    value: [],
    multiple: false,
    doneLabel: 'Done',
    children: null,
    renderHeaderRight: null,
    renderHeaderLeft: null,

    onChange: noop,
    onItemPress: noop,
    onDismiss: noop,
    onShow: noop,
    onSwipe: noop,
    onDone: noop,
    onCancel: noop,
    onRequestClose: noop,
  };

  static getDerivedStateFromProps(props, state) {
    return {
      value: state.isVisible ? state.value : props.value,
      isVisible: isUndefined(props.isVisible) ? state.isVisible : props.isVisible,
    };
  }

  state = {
    isVisible: false,
    value: null,
  };

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
          <Icon style={[styles.checkIcon, selectedStyle]} name="check" />
          <Text style={selectedStyle}>{label}</Text>
        </Body>
      </ListItem>
    );
  };

  renderHeaderRight() {
    const { renderHeaderRight } = this.props;
    const { value } = this.state;
    const onPress = this.action('onDone', this.hide);

    return renderHeaderRight ? renderHeaderRight({ onPress, value }) : (
      <TouchableOpacity onPress={onPress}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  }

  renderHeaderLeft() {
    const { renderHeaderLeft } = this.props;
    const { value } = this.state;
    const onPress = this.action('onCancel', this.hide);

    return renderHeaderLeft ? renderHeaderLeft({ onPress, value }) : (
      <TouchableOpacity cancel onPress={onPress}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    );
  }

  renderModal() {
    const { isVisible, value } = this.state;
    const { styleSheet: styles, label, options, ...props } = this.props;

    const items = options.map((option, index) => ({
      ...option,
      selected: includes(value, option.value),
      first: index === 0,
      last: (index + 1) === options.length,
    }));

    const listHeight = Math.min(options.length * 53, maxHeight);

    return (
      <Backdrop
        {...props}

        height={listHeight}
        isVisible={isVisible}
        title={label}

        onDismiss={this.action('onDismiss')}
        onShow={this.action('onShow')}
        onSwipe={this.action('onSwipe', this.hide)}
        onRequestClose={this.action('onRequestClose', this.hide)}

        headerLeft={this.renderHeaderLeft()}
        headerRight={this.renderHeaderRight()}
      >
        <List dataArray={items} renderRow={this.renderRow} />
      </Backdrop>
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
