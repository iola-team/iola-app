import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, View } from 'native-base';

import { withStyle } from '~theme';
import Placeholder from '../Placeholder';

@withStyle('iola.FieldSection', {
  'iola.Placeholder': {
    'NativeBase.Card': {
      'NativeBase.CardItem': {
        '.header': {
          'NativeBase.Text': {
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            width: 150,
          },
        },

        '.cardBody': {
          alignItems: 'stretch',

          'NativeBase.ViewNB': {
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            height: 20,
            marginBottom: 10,
          },
        },
      },
    },
  },
})
export default class FieldSection extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    label: "",
    loading: false,
  };

  render() {
    const { children, style, loading, label } = this.props;

    const section = (
      <Card transparent style={style}>
        <CardItem header padder>
          <Text>{label}</Text>
        </CardItem>

        <CardItem cardBody foreground={!loading} horizontalPadder>
          {!loading ? children : (
            <Fragment>
              <View />
              <View />
              <View />
            </Fragment>
          )}
        </CardItem>
      </Card>
    );

    return !loading ? section : <Placeholder>{section}</Placeholder>;
  }
}
