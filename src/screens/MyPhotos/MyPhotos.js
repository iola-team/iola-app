import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { PhotoList } from 'components';

const userPhotosQuery = gql`
  query MyPhotosQuery {
    user: me {
      id
      photos {
        edges {
          ...PhotoList_edge
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

@withStyleSheet('Sparkle.MyPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
@withNavigationFocus
export default class UserPhotos extends PureComponent {
  static navigationOptions = {
    title: 'Photos',
  };

  render() {
    const { isFocused, styleSheet: styles } = this.props;

    return (
      <Query skip={!isFocused} query={userPhotosQuery}>
        {({ loading, data }) => (
          <PhotoList
            contentContainerStyle={styles.list}
            edges={loading || !isFocused ? [] : data.user.photos.edges}
            loading={loading || !isFocused}
            noContentText="No photos"
            noContentStyle={styles.noContent}
          />
        )}
      </Query>
    );
  }
}
