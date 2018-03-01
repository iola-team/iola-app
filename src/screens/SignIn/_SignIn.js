import React from 'react';
import { Formik } from 'formik';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { Button, Container, Content, Form, Input, Item, Label, Text, View } from 'native-base';

const Padder = styled(View)`
  margin: 50px 10px;
`;

const LoginForm = () => (
  <Formik
    initialValues={{
      login: '',
      password: '',
    }}
    onSubmit={(values) => {
      console.log(values);
    }}
    render={(props) => {
      const {
        values,
        setFieldValue,
        handleSubmit,
      } = props;

      return (
        <Form>
          <Item>
            <Label>Login</Label>
            <Input
              onChangeText={text => setFieldValue('login', text)}
              values={values.login}
            />
          </Item>

          <Item>
            <Label>Password1</Label>
            <Input
              onChangeText={text => setFieldValue('password', text)}
              values={values.password}
            />
          </Item>

          <Button block onPress={handleSubmit}>
            <Text>Submit</Text>
          </Button>

        </Form>
      );
    }}
  />
)

export default (props) => {
  const {
    values,
    setFieldValue,
    handleSubmit,
  } = props;


  return (
    <Container>
      <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
        <Padder>
          <LoginForm />
        </Padder>
      </Content>
    </Container>
  );
};
