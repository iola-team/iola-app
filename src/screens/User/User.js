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
  console.log(data);

  return (
    <Container>
      <Wrap>
        <View>
          {
            data.loading ? <Text>Loading...</Text> : (
              data.user ? (
                <View>
                  <Line>{data.user.name}</Line>
                  <Line>{data.user.email}</Line>
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
