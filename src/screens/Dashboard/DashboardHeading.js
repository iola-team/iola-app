import React, { PureComponent } from 'react';
import { View, Text } from 'native-base';

import { withStyleSheet } from 'theme';
import { SearchBar } from 'components';

@withStyleSheet('Sparkle.DashboardScreenHead', {
  container: {
    backgroundColor: '#FFFFFF',
  },

  title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#585A61',
  },
})
export default class DashboardHeading extends PureComponent {
  static HEIGHT = 115 + 40;

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
