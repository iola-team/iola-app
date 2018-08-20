import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import FriendList from './FriendList';

const userQuery = gql`
  query UserFriendsQuery($id: ID!) {
    user: node(id: $id) {
      ...on User {
        id
        friends {
          edges {
            ...FriendList_edge
          }
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

class FriendListContainer extends Component {
  static displayName = 'Container(FriendList)';
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  render() {
    const { userId: id, ...props } = this.props;

    return (
      <Query query={userQuery} variables={{ id }}>
        {({ loading, data: { user } }) => (
          <FriendList {...props} edges={loading ? [] : user.friends.edges} />
        )}
      </Query>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <FriendListContainer {...props} forwardedRef={ref} />
));
