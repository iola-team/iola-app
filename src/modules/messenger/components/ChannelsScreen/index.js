import { connect } from 'react-redux';
import { gql, graphql, compose } from 'react-apollo';
import { StackNavigator, NavigationActions } from 'react-navigation';

import ChannelItem from '../ChannelItem';
import ChannelsScreen from './ChannelsScreen';
import NewChannelScreen from '../NewChannelScreen';
import ChannelScreen from '../ChannelScreen';

const NEW_CHANNEL_ROUTE = 'messenger/channels/new';
const CHANNELS_ROUTE = 'messenger/channels/index';
const CHANNEL_ROUTE = 'messenger/channels/view';

const channelsQuery = gql`
  query userChannels($userId: ID!) {
    allChannels(
      orderBy: updatedAt_DESC
      filter: {
        OR: [
          {
            owner: {
              id: $userId
            }
          },
          {
            recipients_some: {
              id: $userId
            }
          }
        ]
      }
    ) {
      ...ChannelItem
    }
  }
  
  ${ChannelItem.fragments.channel}
`;

const mapDispatchToProps = {
  showChannelCreation: () => NavigationActions.navigate({
    routeName: NEW_CHANNEL_ROUTE
  }),
  openChannel: (id) => NavigationActions.navigate({
    routeName: CHANNEL_ROUTE,
    params: {
      channelId: id
    }
  })
};

const ConnectedChannelsScreen = compose(
  connect(null, mapDispatchToProps),
  graphql(channelsQuery, {
    options: () => {


      return {
        variables: {
          userId: 'cj6jd7fk2kver0124unux3co3'
        },

        // pollInterval: 5000
      };
    }
  })
)(ChannelsScreen);

export default StackNavigator({
  [CHANNELS_ROUTE]: {
    screen: ConnectedChannelsScreen,
    navigationOptions: {
      header: null
    }
  },

  [NEW_CHANNEL_ROUTE]: {
    screen: NewChannelScreen
  },

  [CHANNEL_ROUTE]: {
    screen: ChannelScreen
  }
}, {
  initialRouteName: CHANNELS_ROUTE
});