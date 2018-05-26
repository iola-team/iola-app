import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-native-modal';
import { TouchableOpacity, StyleSheet, ScrollView, Easing, Dimensions } from 'react-native';
import { Gateway } from 'react-gateway';
import {
  View,
  Text,
  Button,
  Card,
  CardItem,
  Form,
  Item,
  Input,
  Label,
  Textarea,
  Picker,
  List,
  ListItem,
  Header,
  Left,
  Right,
  Title,
  Body,
} from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';
import SelectField from './SelectField';

const userFragment = gql`
  fragment ProfileFieldsEdit_user on User {
    id
  }
`;

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.ProfileFieldsEdit', {
  root: {

  }
})
export default class ProfileFieldsEdit extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    /**
     * Graphql props
     */
    user: fragmentProp(userFragment).isRequired,
  };

  static defaultProps = {
    something: 0,
    onSomething: () => {},
  };

  state = {
    modal1: false,
  };

  showModal = (modalName, show = true) => {
    this.setState({
      [modalName]: show,
    });
  }

  render() {
    const { style, user } = this.props;

    return (
      <Root style={style}>
        <Card transparent>
          <CardItem header padder>
            <Text>Basic information</Text>
          </CardItem>

          <CardItem cardBody highlight>
            <Form style={{ flex: 1 }}>
              <Item fixedLabel>
                <Label>Name</Label>
                <Input defaultValue="Roman Banan" />
              </Item>
              <Item fixedLabel>
                <Label>Email</Label>
                <Input defaultValue="romek.apple@gmail.com" />
              </Item>
              <Item fixedLabel>
                <Label>Location</Label>
                <Input defaultValue="Belarus, Minsk"/>
              </Item>
              <Item fixedLabel last>
                <Label>Age</Label>
                <Input defaultValue="29" />
              </Item>
            </Form>
          </CardItem>

          <CardItem header padder>
            <Text>About me</Text>
          </CardItem>

          <CardItem cardBody highlight>
            <Form style={{ flex: 1 }}>
              <Item fixedLabel>
                <Label>Occupation</Label>
                <Input defaultValue="Software developer" />
              </Item>
              <Item fixedLabel last>
                <Label>Description</Label>

                  <TouchableOpacity
                    onPress={() => {
                      this.modal2.open();
                      this.text.focus();
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'flex-start'
                    }}
                  >
                    <Text>This song is incredible. Having social anxiety, I can relate to it a lot.</Text>
                  </TouchableOpacity>

              </Item>
            </Form>
          </CardItem>

          <CardItem header padder>
            <Text>Other information</Text>
          </CardItem>
          <CardItem cardBody highlight>
            <Form style={{ flex: 1 }}>
              <Item fixedLabel>
                <Label>Hobby</Label>
                <Input multiline defaultValue="Our vision has always been to create an iPhone that is entirely screen. " />
              </Item>
              <Item fixedLabel last>
                <Label>Favourite food</Label>

                <SelectField />
              </Item>
            </Form>
          </CardItem>
        </Card>


        <Modal
          useNativeDriver={false}
          backdropColor={'#FFFFFF'}
          backdropOpacity={0.8}
          isVisible={this.state.modal1}
          onSwipe={() => {
            this.showModal('modal1', false);
          }}
          onBackdropPress={() => {
            this.showModal('modal1', false);
          }}
          onBackButtonPress={() => {
            this.showModal('modal1', false);
          }}
          swipeDirection="down"
          style={{
            margin: 0,
            justifyContent: "flex-end",
          }}
        >
          <View>
            <View highlight padder style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: '#BDC0CB'
            }}>
              <Text>Favourite food</Text>
              <TouchableOpacity onPress={() => {
                this.showModal('modal1', false);
              }}>
                <Text style={{
                  color: '#5F96F2',
                  fontWeight: 'bold',
                }}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{
              maxHeight: Dimensions.get("window").height * 0.6,
              backgroundColor: '#FFFFFF',
            }}>
              <List>
                <ListItem>
                  <Text>Tacos</Text>
                </ListItem>
                <ListItem>
                  <Text>Kebab</Text>
                </ListItem>
                <ListItem>
                  <Text>Pizza</Text>
                </ListItem>
                <ListItem>
                  <Text>Pasta</Text>
                </ListItem>
                <ListItem>
                  <Text>Avocados</Text>
                </ListItem>
                <ListItem>
                  <Text>Tacos 2</Text>
                </ListItem>
                <ListItem>
                  <Text>Kebab 2</Text>
                </ListItem>
                <ListItem>
                  <Text>Pizza 2</Text>
                </ListItem>
                <ListItem>
                  <Text>Pasta 2</Text>
                </ListItem>
                <ListItem last>
                  <Text>Avocados 2</Text>
                </ListItem>
              </List>
            </ScrollView>
          </View>
        </Modal>

        <ModalBox
          ref={ref => this.modal2 = ref}
          style={{
            height: 380,
          }}
          animationDuration={300}
          position="top"
          entry={'top'}
          coverScreen
          backdropColor={'#FFFFFF'}
          backdropOpacity={1}
          easing={Easing.out(Easing.ease)}
        >
          <View>
            <View highlight padder style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text>Description</Text>
              <TouchableOpacity onPress={() => {
                this.modal2.close();
              }}>
                <Text style={{
                  color: '#5F96F2',
                  fontWeight: 'bold',
                }}>Done</Text>
              </TouchableOpacity>
            </View>
            <Textarea
              ref={ref => this.text = ref}
              autoFocus rowSpan={10} defaultValue={'This song is incredible. Having social anxiety, I can relate to it a lot.'} />
          </View>
        </ModalBox>
      </Root>
    );
  }
}
