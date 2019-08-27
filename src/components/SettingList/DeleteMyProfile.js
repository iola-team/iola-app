import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Text, Toast } from 'native-base';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyleSheet } from '~theme';
import * as routes from '~screens/routeNames';
import ActionSheet from '../ActionSheet';

@withStyleSheet('iola.DeleteMyProfile', {
  button: {
    marginTop: 'auto',
    marginHorizontal: 48,
    marginBottom: 32,
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
export default class DeleteMyProfile extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  // TODO: This method contains a lot of imperative logic. Think about external component or something like that
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
    await client.resetStore();

    try {
      await deleteUser({
        variables: {
          id: me.id,
        },
      });

      Toast.show({
        text: 'Your profile was successfully deleted.',
        type: 'success',
        buttonText: 'Ok',
        duration: 5000,
      });
    } catch (error) {
      Toast.show({
        text: 'Something unexpectedly went wrong. Please try again later.',
        type: 'danger',
        buttonText: 'Ok',
        duration: 5000,
      });
    }

    navigate(routes.LAUNCH, { loading: true });
  };

  render() {
    const { styleSheet: styles } = this.props;

    return (
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
    );
  }
}
