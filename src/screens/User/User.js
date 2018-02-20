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
              <View>
                <Line>{data.allUsers[0].name}</Line>
                <Line>{data.allUsers[0].email}</Line>
              </View>
            )
          }
        </View>
      </Wrap>
    </Container>
  );
};
