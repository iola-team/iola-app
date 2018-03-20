import React from 'react';
import { Container, Content, View, Text } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';

const Line = connectToStyleSheet('line', View);

@styleSheet('Sparkle.UserScreen', {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  line: {
    padding: 10,
  }
})
export default ({ data }) => {
  return (
    <Container>
      <Content contentContainerStyle={styleSheet.content}>
        <View>
          {
            data.loading ? <Text>Loading...</Text> : (
              data.user ? (
                <View>
                  <Line>Name: {data.user.name}</Line>
                  <Line>Email: {data.user.email}</Line>
                </View>
              ) : (
                <Line>Not found</Line>
              )
            )
          }
        </View>
      </Content>
    </Container>
  );
};
