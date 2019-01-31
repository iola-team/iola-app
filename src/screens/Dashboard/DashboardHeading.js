import React, { PureComponent } from 'react';
import { View, Text } from 'native-base';

import { withStyleSheet } from 'theme';
import { SearchBar } from 'components';

@withStyleSheet('Sparkle.DashboardScreenHead', {
  container: {
    backgroundColor: '#FFFFFF',
  },

  title: {
    paddingVertical: 13,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 20,
    color: '#35373E',
  },
})
export default class DashboardHeading extends PureComponent {
  static HEIGHT = 115 + 65;

  state =  {
    searchPhrase: '',
  };

  onSearch = searchPhrase => this.setState({ searchPhrase });

  render() {
    const { styleSheet: styles } = this.props;
    const { searchPhrase } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <SearchBar onSearch={this.onSearch} />
      </View>
    );
  }
}
