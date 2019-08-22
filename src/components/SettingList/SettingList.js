import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Button, Text, List, ListItem, Right, Body, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LICENSE_AGREEMENT_URL, PRIVACY_POLICY_URL } from 'react-native-dotenv';

import { withStyleSheet } from '~theme';
import { ScrollView } from '../TabNavigator';
import ActionSheet from '../ActionSheet';
import * as routes from '../../screens/routeNames';

@withStyleSheet('Sparkle.SettingList', {
  button: {
    marginTop: 'auto',
    marginHorizontal: 48,
    marginBottom: 32,
    height: 50,
  },
})
@graphql(gql`
  query {
    me {
      id
    }
  }`, {
  options: {
    fetchPolicy: 'cache-first',
  },
})
@graphql(gql`
  mutation deleteUserMutation($id: ID!) {
    deleteUser(id: $id) {
      deletedId
    }
  }
`, {
  name: 'deleteUser',
})
@withApollo
@withNavigation
export default class SettingList extends Component {
  openUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    }
  };

  onDeleteMyProfile = async () => {
    const {
      client,
      deleteUser,
      data: {
        me,
      },
      navigation: {
        navigate,
      },
    } = this.props;

    navigate(routes.LOADING);

    const { data } = await deleteUser({
      variables: {
        id: me.id,
      },
    });

    if (data?.deleteUser.deletedId) {
      await client.resetStore();
      navigate(routes.LAUNCH, { loading: true });
      alert('Your profile was successfully deleted');
    }

    // TODO: handle the error?
  };

  render() {
    const { styleSheet: styles, ...props } = this.props;

    return (
      <ScrollView {...props}>
        <List>
          <ListItem onPress={() => this.openUrl(PRIVACY_POLICY_URL)} icon button first>
            <Body>
              <Text>Privacy Policy</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem onPress={() => this.openUrl(LICENSE_AGREEMENT_URL)} icon button last>
            <Body>
              <Text>License Agreement</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>
        </List>

        <ActionSheet
          title="Please note, after deleting your profile, all your data will be gone forever"
          options={['Cancel', 'Delete my profile']}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={index => index === 1 && this.onDeleteMyProfile()}
        >
          {show => (
            <Button style={styles.button} onPress={show} light bordered secondary block>
              <Text>Delete my profile</Text>
            </Button>
          )}
        </ActionSheet>
      </ScrollView>
    );
  }
}
