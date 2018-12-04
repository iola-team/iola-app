import PhotoList from './PhotoList';

export default PhotoList;

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import gql from 'graphql-tag';
// import { Query } from 'react-apollo';

// import PhotoList from './PhotoList';

// const userQuery = gql`
//   query UserPhotosQuery($id: ID!) {
//     user: node(id: $id) {
//       ...on User {
//         id
//         photos {
//           edges {
//             ...PhotoList_edge
//           }
//         }
//       }
//     }
//   }
  
//   ${PhotoList.fragments.edge}
// `;

// export default class PhotoListContainer extends Component {
//   static displayName = 'Container(PhotoList)';
//   static propTypes = {
//     userId: PropTypes.string.isRequired,
//   };

//   render() {
//     const { userId: id, ...props } = this.props;

//     return (
//       <Query query={userQuery} variables={{ id }}>
//         {({ loading, networkStatus, data: { user } }) => (
//           <PhotoList 
//             {...props} 
//             edges={loading ? [] : user.photos.edges} 
//             networkStatus={networkStatus}
//           />
//         )}
//       </Query>
//     );
//   }
// }