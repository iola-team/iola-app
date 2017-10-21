export default from './ChannelItem';


// import { connect } from 'react-redux';
// import { graphql, gql, compose } from 'react-apollo';
//
// import ChannelItem from './ChannelItem';
//
// const channelQuery = gql`
// query channelItem($channelId: ID!){
//   Channel(id: $channelId) {
//     id
//     recipients {
//       id
//       name
//     }
//     messages
//   }
// }
// `;
//
// const messageFragment = gql`
// fragment ChatMessage on Message {
//   id
//   text
//   user {
//     id
//     name
//   }
// }
// `;
//
// const messagesQuery = gql`
// ${messageFragment}
//
// query channelMessages($channelId: ID!) {
//   allMessages(
//     filter: {
//       channel: {
//         id: $channelId
//       }
//     }
//     orderBy: updatedAt_DESC
//   ) {
//     ...ChatMessage
//   }
// }
// `;
//
// export default compose(
//   connect(),
//
//   graphql(channelQuery, {
//     props: ({ data }) => {
//       return {
//         channel: data.Channel || {},
//       };
//     },
//
//     options: ({ channelId }) => ({
//       variables: {
//         channelId
//       },
//       fetchPolicy: 'cache-only'
//     })
//   }),
//
//   graphql(messagesQuery, {
//     props: ({ data }) => {
//       return {
//         messages: data.allMessages || [],
//       };
//     },
//
//     options: ({ channelId }) => ({
//       variables: {
//         channelId
//       },
//       fetchPolicy: 'cache-only'
//     })
//   })
// )((ChannelItem));