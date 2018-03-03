import React from 'react';
import { Container, View, Text } from 'native-base';
import styled from 'styled-components/native';

const Wrap = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Line = styled(Text)`
  padding: 10px;
`;

export default ({ data }) => {
  return (
    <Container>
      <Wrap>
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
      </Wrap>
    </Container>
  );
};
