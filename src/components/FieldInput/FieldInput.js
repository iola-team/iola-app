import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Body, Right, Spinner, Toast } from 'native-base';

import { withStyle } from '~theme';
import TouchableOpacity from '../TouchableOpacity';
import FieldItem from '../FieldItem';
import Icon from '../Icon';

@withStyle('Sparkle.FieldItemInput', {
  'Sparkle.FieldItem': {
    'NativeBase.Right': {
      'Sparkle.TouchableOpacity': {
        'NativeBase.Icon': {
          color: '#FF0000',
        },
      },

      'NativeBase.Icon': {
        color: '#FF0000',
      },
    },
  },
})
export default class FieldInput extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    last: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
    error: '',
    last: false,
  };

  state = {
    isToastVisible: false,
  };

  showErrorToast = () => {
    const { error } = this.props;

    this.setState({ isToastVisible: true });

    Toast.show({
      text: error,
      duration: 5000,
      buttonText: 'Ok',
      type: 'danger',
      onClose: () => {
        this.setState({ isToastVisible: false });
      },
    });
  };

  renderRight() {
    const { loading, error } = this.props;
    const { isToastVisible } = this.state;

    if (loading) return <Spinner size="small" />;

    if (error) {
      return (
        <TouchableOpacity disabled={isToastVisible} onPress={this.showErrorToast}>
          <Icon name="alert" />
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    const { label, last, children } = this.props;

    return(
      <FieldItem last={last}>
        <Label>{label}</Label>
        <Body>{children}</Body>
        <Right>{this.renderRight()}</Right>
      </FieldItem>
    );
  }
}
