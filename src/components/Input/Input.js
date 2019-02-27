import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Label, Body, Right, Spinner, Toast } from 'native-base';

import { withStyle } from '~theme';
import TouchableOpacity from '../TouchableOpacity';
import Icon from '../Icon';

const iconTheme = {
  '.disabled': {
    opacity: 0.5,
  },

  fontSize: 22,
  color: '#FF0000',
};

@withStyle('Sparkle.Input', {
  'NativeBase.Label': {
    flex: 1,
    color: '#585A61',
    fontWeight: '600',
    paddingRight: 5,
    flexWrap: 'wrap',
  },

  'NativeBase.Body': {
    'NativeBase.Input': {
      padding: 0,
    },

    'NativeBase.Text': {
      fontSize: 14,
      paddingVertical: 5,
    },

    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  'NativeBase.Right': {
    'NativeBase.Spinner': {
      height: 20,
    },

    'Sparkle.TouchableOpacity': {
      'NativeBase.Icon': {
        ...iconTheme,

        margin: 0,
      },

      alignSelf: 'stretch',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flex: 1,
    },

    'NativeBase.Icon': {
      ...iconTheme,
    },

    flexGrow: 0,
    flexBasis: 30,
  },

  '.last': {
    borderBottomWidth: 0,
  },

  minHeight: 50,
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: '#C9C9C9',
})
export default class Input extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    last: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
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
      buttonText: 'OK',
      type: 'danger',
      onClose: () => {
        this.setState({ isToastVisible: false });
      },
    });
  };

  renderRight() {
    const { isLoading, error } = this.props;
    const { isToastVisible } = this.state;

    if (isLoading) return <Spinner size={20} />;

    if (error) {
      return (
        <TouchableOpacity
          disabled={isToastVisible}
          onPress={this.showErrorToast}
        >
          <Icon name="alert" />
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    const { label, error, style, children } = this.props;

    return(
      <View style={style}>
        <Label>{label}</Label>
        <Body>{children}</Body>
        <Right>{this.renderRight()}</Right>
      </View>
    );
  }
}
