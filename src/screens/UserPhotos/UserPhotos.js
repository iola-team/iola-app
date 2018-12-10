import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { PhotoList } from 'components';

const userPhotosQuery = gql`
  query UserPhotosQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        photos {
          edges {
            ...PhotoList_edge
          }
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

@withStyleSheet('Sparkle.UserPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  }
})
@withNavigationFocus
export default class UserPhotos extends PureComponent {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { navigation, isFocused, styleSheet: styles } = this.props;
    const id = navigation.state.params.id;

    return (
      <Query skip={!isFocused} query={userPhotosQuery} variables={{ id }}>
        {({ loading, data }) => (
          <PhotoList
            contentContainerStyle={styles.list}
            edges={loading || !isFocused ? [] : data.user.photos.edges}
            loading={loading || !isFocused}
          />
        )}
      </Query>
    );
  }
}
