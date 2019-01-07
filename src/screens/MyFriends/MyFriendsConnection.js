import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { get } from 'lodash';

import { FriendList } from 'components';

const userFriendsQuery = gql`
  query MyFriendsQuery {
    me {
      id
      friends(filter: {
        friendshipStatusIn: [ACTIVE, PENDING]
      }) {
        edges {
          ...FriendList_edge
        }
      }
    }
  }
  
  ${FriendList.fragments.edge}
`;

@graphql(userFriendsQuery, {
  skip: props => !!props.skip,
})
export default class MyFriendsConnection extends Component {
  static propTypes = {
    data: PropTypes.object,
    skip: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    skip: false,
  };

  onItemPress = ({ node }) => {
    
  };

  onAcceptPress = ({ node }) => {

  };

  onIgnorePress = ({ node }) => {

  };

  onCancelPress = ({ node }) => {

  };

  render() {
    const { data: { loading, me }, skip, ...props } = this.props;
    const edges = get(me, 'friends.edges', []);

    return (
      <FriendList
        {...props}
        edges={edges}
        loading={skip || loading}
        noContentText="No friends"

        onItemPress={this.onItemPress}
        onAcceptPress={this.onAcceptPress}
        onIgnorePress={this.onIgnorePress}
        onCancelPress={this.onCancelPress}
      />
    );
  }
}