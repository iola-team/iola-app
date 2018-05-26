import React, { Component } from 'react';
import { groupBy, map } from 'lodash';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import {
  View,
  Text,
  Button,
} from 'native-base';

import Section from './Section';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme/index';

const userFragment = gql`
  fragment FieldForm_user on User {
    id
    profile {
      accountType {
        id
        fields {
          id
          name
          label
          section {
            id
            label
          }
          configs {
            ...on ProfileFieldTextConfigs {
              minLength
              maxLength
            }
          }
        }
      }
    }
  }
`;

const Root = connectToStyleSheet('root', View);

@styleSheet('Sparkle.FieldForm', {
  root: {

  }
})
export default class FieldForm extends Component {
  static fragments = {
    user: userFragment,
  }

  static propTypes = {
    user: fragmentProp(userFragment).isRequired,
  };

  static defaultProps = {

  };

  render() {
    const { style, user: { profile } } = this.props;
    const sections = map(
      groupBy(profile.accountType.fields, ({ section }) => section.id),
      fields => ({
        ...fields[0].section,
        fields,
      }),
    );

    return (
      <Root style={style}>
        {
          sections.map(({ id, label, fields }) => (
            <Section key={id} label={label}>
              {
                fields.map(({ id, label }) => (
                  <Text key={id}>{label}</Text>
                ))
              }
            </Section>
          ))
        }
      </Root>
    );
  }
}
