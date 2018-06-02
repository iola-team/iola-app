import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { UserAvatar } from 'components';
import { withStyleSheet as styleSheet } from 'theme';

const propsToVariables = props => ({
  userId: props.navigation.state.params.userId,
});

@graphql(gql`
    query ChannelWithUserQuery($userId: ID!) {
      user: node(id: $userId) {
        id
        ...UserAvatar_user
      }
    }

    ${UserAvatar.fragments.user}
`, {
  options: (props) => ({
    variables: propsToVariables(props),
  }),
})
@styleSheet('Sparkle.PhotoPreview')
export default class Channel extends Component {
  static navigationOptions = ({ navigation }) => ({ title: '1 of 5' });

  render() {
    const { data } = this.props;

    return (
      <Container>
        <Content padder>
          <Text>{JSON.stringify(data)}</Text>
        </Content>
      </Container>
    );
  }
}
