import React, { Component } from 'react';
import { Text } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(gql`
  query MyPhotosCountQuery {
    me {
      id
      photos @connection(key: "MyPhotos") {
        totalCount
      }
    }
  }
`)
export default class TabBarLabel extends Component {
  render() {
    const { data } = this.props;
    const totalCount = data.me?.photos.totalCount;

    return <Text>{ totalCount ? `Photos ${totalCount}` : 'Photos' }</Text>;
  }
}