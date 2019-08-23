import React, { PureComponent } from 'react';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import { USER } from '../routeNames';
import DashboardAllConnection from './DashboardAllConnection';

@withStyleSheet('iola.DashboardAllScreen', {
  list: {
    paddingTop: 8,
  },
})
export default class DashboardAll extends PureComponent {
  static navigationOptions = {
    title: 'All',
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(USER, { id: node.id });
  };

  render() {
    return (
      <Container>
        <DashboardAllConnection onItemPress={this.onItemPress} />
      </Container>
    );
  }
}
