import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  Text,
  View,
  Button,
} from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import UserAvatar from '../UserAvatar'

const userFragment = gql`
  fragment AvatarToolbar_user on User {
    id
    avatar {
      id
    }
    ...UserAvatar_user
  }
  
  ${UserAvatar.fragments.user}
`;

@styleSheet('Sparkle.AvatarToolbar', {
  root: {
    flexDirection: 'row',
  },

  buttons: {
    flexDirection: 'row',
  },

  button: {
    marginRight: 8,
    width: 96,
  },

  rightSection: {
    justifyContent: 'space-between',
  }
})
export default class AvatarToolbar extends PureComponent {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    onAddPress: PropTypes.func.isRequired,
    onDeletePress: PropTypes.func.isRequired,
    onChangePress: PropTypes.func.isRequired,
  };

  render() {
    const { styleSheet, style, user } = this.props;

    const { avatar } = user;

    return (
      <View style={[styleSheet.root, style]}>
        <UserAvatar large user={user} />
        <View horizontalPadder style={styleSheet.rightSection}>
          <Text note>
            Edit profile photo
          </Text>
          <View style={styleSheet.buttons}>
            {
              avatar ? (
                <Fragment>
                  <Button
                    block
                    style={styleSheet.button}
                    onPress={this.props.onChangePress}
                  >
                    <Text>Change</Text>
                  </Button>

                  <Button
                    block
                    secondary
                    bordered
                    style={styleSheet.button}
                    onPress={this.props.onDeletePress}
                  >
                    <Text>Delete</Text>
                  </Button>
                </Fragment>
              ) : (
                <Button
                  block
                  style={styleSheet.button}
                  onPress={this.props.onAddPress}
                >
                  <Text>Add</Text>
                </Button>
              )
            }
          </View>
        </View>
      </View>
    );
  }
}
