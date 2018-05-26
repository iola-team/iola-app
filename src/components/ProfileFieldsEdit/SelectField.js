import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
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

const itemShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: valueShape,
});

@styleSheet('Sparkle.SelectField', {
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
export default class SelectField extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(itemShape),
    value: PropTypes.arrayOf(valueShape),
    onSelect: PropTypes.func.isRequired,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
  }

  static defaultProps = {
    onHide: () => null,
    onShow: () => null,
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

  renderInput() {
    return (
      <TouchableOpacity onPress={this.show}>
        <Text>Hello select field!</Text>
      </TouchableOpacity>
    );
  }

  renderRow = (item) => {
    const { label, value } = item;
    const { styleSheet: styles, value: selectedValues } = this.props;
    const selected = selectedValues.indexOf(value) > 0;

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
      onHide,
      onShow,
    } = this.props;

    const items = [
      { label: 'Tacos', value: '1' },
      { label: 'Kebab', value: '2' },
      { label: 'Pizza', value: '3' },
      { label: 'Pasta', value: '4' },
      { label: 'Avocados', value: '5' },
      { label: 'Tacos 2', value: '6' },
      { label: 'Kebab 2', value: '7' },
      { label: 'Pizza 2', value: '8' },
      { label: 'Pasta 2', value: '9' },
      { label: 'Avocados 2', value: '10' },
    ];

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
            <Text>Favourite food</Text>
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
    const { style, styleSheet: styles } = this.props;

    return (
      <View style={[styles.root, style]}>
        {this.renderInput()}
        {this.renderModal()}
      </View>
    );
  }
}
