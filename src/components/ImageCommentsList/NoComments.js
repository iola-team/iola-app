import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { withStyleSheet as styleSheet } from 'theme';
import Icon from '../Icon';

@styleSheet('Sparkle.NoComments', {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FB',
  },

  iconBackground: {
    marginBottom: 19,
    borderRadius: 60,
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
  },

  icon: {
    margin: 'auto',
    fontSize: 45,
    color: '#C5CAD1',
  },

  text: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
    color: '#BDC0CB',
  },
})
export default class NoComments extends PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
  };

  render() {
    const { height, styleSheet: styles } = this.props;

    return (
      <View style={[styles.container, { height }]} padderHorizontal>
        <View style={styles.iconBackground}>
          <Icon style={styles.icon} name="comments-empty-state" />
        </View>
        <Text style={styles.text}>No comments yet</Text>
        <Text style={styles.text}>Be the first to comment</Text>
      </View>
    );
  }
}
