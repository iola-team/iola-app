import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { AvatarEdit } from 'components';

@graphql(gql`
  query ProfileHeadingQuery {
    me {
      id
      ...AvatarEdit_user
    }
  }

  ${AvatarEdit.fragments.user}
`)
export default class ProfileHeading extends PureComponent {
  static HEIGHT = AvatarEdit.HEIGHT;

  render() {
    const { data: { loading, user }, ...props } = this.props;

    return <AvatarEdit {...props} user={user} loading={loading} />;
  }
}
