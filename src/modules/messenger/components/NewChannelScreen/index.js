import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { graphql, gql, compose } from 'react-apollo';

import NewChannelScreen from './NewChannelScreen';
import { searchUsers, getUserSearchPhrase, goToChannel } from '../../ducks';

const usersQuery = gql`
query Users($keyword: String!){
  allUsers(
    filter: {
      name_starts_with: $keyword
    }
  ) {
    id,
    name,
    email,
  }
}
`;

const newChannelMutation = gql`
mutation createChannel($ownerId: ID!, $recipientIds: [ID!]) {
  createChannel(
    ownerId: $ownerId
    recipientsIds: $recipientIds
  ) {
    id
  }
}
`;

const mapStateToProps = createStructuredSelector({
  searchPhrase: getUserSearchPhrase
});

const mapDispatchToProps = {
  searchUsers,
  goToChannel
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),

  graphql(usersQuery, {
    options: props => ({
      variables: {
        keyword: props.searchPhrase
      }
    })
  }),

  graphql(newChannelMutation, {
    props: ({ mutate, ownProps: { goToChannel } }) => {
      return {
        async createChannel(ownerId, recipientIds) {
          const {
            data: {
              createChannel: {
                id
              }
            }
          } = await mutate({
            variables: {
              ownerId,
              recipientIds
            },
            refetchQueries: [
              'userChannels'
            ]
          });

          goToChannel(id);
        }
      }
    }
  })
)(NewChannelScreen);