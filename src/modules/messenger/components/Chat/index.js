import { connect } from 'react-redux';
import { graphql, gql, compose } from 'react-apollo';

import Chat from './Chat';

const messagesQuery = gql`
  query currentChannel($channelId: ID!) {
    messages: allMessages(
      filter: {
        channel: {
          id: $channelId
        }
      }
      orderBy: createdAt_DESC
    ) {
      ...Chat_message
    }
  }

  ${Chat.fragments.message}
`;

const userQuery = gql`
  query User($userId: ID!) {
    User(id: $userId) {
      ...Chat_user
    }
  }
  
  ${Chat.fragments.user}
`;

const newMessageMutation = gql`
  mutation createMessage($userId: ID!, $channelId: ID!, $text: String!) {
    createMessage(
      userId: $userId
      channelId: $channelId
      text: $text
    ) {
      id
      ...Chat_message
    }
  }

  ${Chat.fragments.message}
`;

export default compose(
  connect(),

  graphql(messagesQuery, {
    props: ({ data }) => ({
      messages: data.messages,
      loading: data.loading
    }),

    options: ({ channelId }) => ({
      variables: {
        channelId
      },

      pollInterval: 5000
    })
  }),

  graphql(userQuery, {
    props: ({ data }) => ({
      user: data.User || {
        id: 'cj6jd7fk2kver0124unux3co3'
      }
    }),

    options: () => ({
      variables: {
        userId: 'cj6jd7fk2kver0124unux3co3'
      }
    })
  }),

  graphql(newMessageMutation, {
    props: ({ mutate, ownProps: { channelId, onSend } }) => {
      return {

        onSend: messages => Promise.all(messages.map(async ({ user, text, _id: id }) => {
          const optimisticMessage = {
            __typename: 'Message',
            id,
            text,
            user
          };

          const {
            data: {
              createMessage: message
            }
          } = await mutate({
            variables: {
              channelId,
              userId: user.id,
              text
            },

            optimisticResponse: {
              __typename: 'Mutation',
              createMessage: optimisticMessage,
            },

            update(store, { data: { createMessage: message } }) {
              const query = {
                variables: {
                  channelId
                },
                query: messagesQuery
              };

              const data = store.readQuery(query);
              data.messages.unshift(message);

              store.writeQuery({
                ...query,
                data
              });
            }
          });

          return message;
        }))
      }
    }
  })
)((Chat));