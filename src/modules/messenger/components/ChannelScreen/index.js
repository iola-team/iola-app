import { connect } from 'react-redux';
import { graphql, gql, compose } from 'react-apollo';

import ChannelScreen from './ChannelScreen';
import ChannelItem from '../ChannelItem'

const channelQuery = gql`
  query channelItem($channelId: ID!){
    Channel(id: $channelId) {
      ...ChannelItem
    }
  }
  
  ${ChannelItem.fragments.channel}
`;

export default compose(
  connect(),

  graphql(channelQuery, {
    props: ({ data }) => {
      return {
        channel: data.Channel,
        loading: data.loading
      };
    },

    options: ({ navigation }) => ({
      variables: {
        channelId: navigation.state.params.channelId
      }
    })
  })
)((ChannelScreen));