import React, { PureComponent, Fragment } from 'react';
import { find } from 'lodash';
import { Text } from 'native-base';

import { withStyleSheet } from '~theme';
import FieldInput from './FieldInput';
import ListPicker from '../ListPicker';
import TouchableOpacity from '../TouchableOpacity';

@withStyleSheet('iola.SelectInput')
export default class Select extends PureComponent {
  state = {
    isPickerVisible: false,
  };

  showPicker = () => {
    this.setState({ isPickerVisible: true });
  };

  hidePicker = () => {
    this.setState({ isPickerVisible: false });
  };

  onDone = value => {
    const { onChange } = this.props;

    this.hidePicker();
    onChange(value);
  }

  render() {
    const {
      value: rawValue,
      label,
      options,
      multiple,
      placeholder,
      styleSheet,
      onFinishEditing,
      ...props
    } = this.props;

    const { isPickerVisible } = this.state;

    const value = rawValue || [];
    const selectedLabels = value.map(v => find(options, { value: v }).label);

    return (
      <Fragment>
        <FieldInput label={label} {...props}>
          <TouchableOpacity onPress={this.showPicker}>
            <Text note={!value.length}>
              {value.length ? selectedLabels.join(', ') : placeholder}
            </Text>
          </TouchableOpacity>
        </FieldInput>

        <ListPicker
          isVisible={isPickerVisible}
          value={value}
          label={label}
          options={options}
          multiple={multiple}
          onDone={this.onDone}
          onSwipe={this.hidePicker}
          onCancel={this.hidePicker}
          onRequestClose={this.hidePicker}
          onDismiss={onFinishEditing}
        />
      </Fragment>
    );
  }
}
