import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from '~storybook';
import ProfileFieldInput from './ProfileFieldInput';

const stories = storiesOf('Components/ProfileFieldInput', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const fields = [
  {
    id: 'Field:1',
    name: 'text',
    label: 'Text',
    presentation: 'TEXT',
    isRequired: true,
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: false,
      secure: false,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:2',
    name: 'password',
    label: 'Password',
    presentation: 'TEXT',
    isRequired: true,
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: false,
      secure: true,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:3',
    name: 'gender',
    label: 'Select',
    presentation: 'SELECT',
    isRequired: true,
    configs: {
      presentation: 'SELECT',
      multiple: false,
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ],
    },
  },
  {
    id: 'Field:4',
    name: 'multi-select',
    label: 'Multi-Select',
    presentation: 'SELECT',
    isRequired: true,
    configs: {
      presentation: 'SELECT',
      multiple: true,
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
        { label: 'Option 4', value: '4' },
        { label: 'Option 5', value: '5' },
      ],
    },
  },
  {
    id: 'Field:5',
    name: 'multiline',
    label: 'Multi-line',
    presentation: 'TEXT',
    isRequired: false,
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: true,
      secure: false,
      regexp: null,
      minLength: 0,
      maxLength: 200,
    },
  },
  {
    id: 'Field:6',
    name: 'date',
    label: 'Date',
    presentation: 'DATE',
    isRequired: true,
    configs: {
      presentation: 'DATE',
      minDate: new Date('1980'),
      maxDate: new Date(),
    },
  },
  {
    id: 'Field:7',
    name: 'switch',
    label: 'Switch',
    presentation: 'SWITCH',
    isRequired: true,
    configs: {
      presentation: 'SWITCH',
    },
  },
  {
    id: 'Field:8',
    name: 'email',
    label: 'Email',
    presentation: 'TEXT',
    isRequired: true,
    configs: {
      presentation: 'TEXT',
      format: 'EMAIL',
      multiline: false,
      secure: false,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:9',
    name: 'url',
    label: 'Url',
    presentation: 'TEXT',
    isRequired: true,
    configs: {
      presentation: 'TEXT',
      format: 'URL',
      multiline: false,
      secure: false,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
];

const values = [
  {
    id: 'Value:1',
    field: find(fields, { id: 'Field:1' }),
    data: {
      presentation: 'TEXT',
      value: 'Text value',
    },
  },
  {
    id: 'Value:2',
    field: find(fields, { id: 'Field:2' }),
    data: {
      presentation: 'TEXT',
      value: 'Secure value',
    },
  },
  {
    id: 'Value:3',
    field: find(fields, { id: 'Field:3' }),
    data: {
      presentation: 'SELECT',
      value: ['1'],
    },
  },
  {
    id: 'Value:4',
    field: find(fields, { id: 'Field:4' }),
    data: {
      presentation: 'SELECT',
      value: ['2', '3'],
    },
  },
  {
    id: 'Value:5',
    field: find(fields, { id: 'Field:5' }),
    data: {
      presentation: 'TEXT',
      value: 'Multi-line text value',
    },
  },
  {
    id: 'Value:6',
    field: find(fields, { id: 'Field:6' }),
    data: {
      presentation: 'DATE',
      value: new Date('1988'),
    },
  },
  {
    id: 'Value:7',
    field: find(fields, { id: 'Field:7' }),
    data: {
      presentation: 'SWITCH',
      value: true,
    },
  },
  {
    id: 'Value:8',
    field: find(fields, { id: 'Field:8' }),
    data: {
      presentation: 'TEXT',
      value: 'qqreq@gmail.com',
    },
  },
  {
    id: 'Value:9',
    field: find(fields, { id: 'Field:9' }),
    data: {
      presentation: 'TEXT',
      value: 'www.google.com',
    },
  },
];

const users = [
  {
    id: 'User:1',
    profile: {
      accountType: {
        id: 'AccountType:1',
        fields,
      },
      values: () => values,
    },
  },
  {
    id: 'User:2',
    profile: {
      accountType: {
        id: 'AccountType:1',
        fields,
      },
      values: [],
    },
  },
  {
    id: 'User:3',
    profile: {
      accountType: {
        id: 'AccountType:1',
        fields,
      },
      values: () => delay(1000, values),
    },
  },
];

const dataStore = {
  users,
  fields,
  values,
};

const typeDefs = gql`
  scalar Date

  type Query {
    node(id: ID!): User!
  }

  type User {
    id: ID!

    profile: Profile!
  }

  type Profile {
    accountType: AccountType!
    values: [ProfileFieldValue!]!
  }

  type AccountType {
    id: ID!
    fields: [ProfileField!]!
  }

  enum ProfileFieldPresentation {
    TEXT
    DATE
    SELECT
    SWITCH
    RANGE
  }

  type ProfileFieldSection {
    id: ID!
    label: String!
  }

  enum StringFormat {
    EMAIL
    URL
  }

  type ProfileFieldTextConfigs {
    format: StringFormat
    multiline: Boolean
    secure: Boolean
    regexp: String
    minLength: Int
    maxLength: Int
  }

  type ProfileFieldSelectOption {
    label: String!
    value: String!
  }

  type ProfileFieldSelectConfigs {
    multiple: Boolean
    options: [ProfileFieldSelectOption!]!
  }

  type ProfileFieldDateConfigs {
    minDate: Date!
    maxDate: Date!
  }

  type ProfileFieldDefaultConfigs {
    presentation: ProfileFieldPresentation!
  }

  union ProfileFieldConfigs = ProfileFieldTextConfigs | ProfileFieldSelectConfigs | ProfileFieldDateConfigs | ProfileFieldDefaultConfigs

  type ProfileField {
    id: ID!
    name: String!
    label: String!
    presentation: ProfileFieldPresentation!
    isRequired: Boolean!
    section: ProfileFieldSection!
    configs: ProfileFieldConfigs
  }

  type ProfileFieldTextValue {
    value: String
  }

  type ProfileFieldSelectValue {
    value: [String!]
  }

  type ProfileFieldDateValue {
    value: Date
  }

  type ProfileFieldSwitchValue {
    value: Boolean
  }

  union ProfileFieldValueData = ProfileFieldTextValue | ProfileFieldSelectValue | ProfileFieldDateValue | ProfileFieldSwitchValue

  type ProfileFieldValue {
    id: ID!
    field: ProfileField!
    data: ProfileFieldValueData
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore }) => find(dataStore.users, { id }),
  },

  ProfileFieldConfigs: {
    __resolveType: ({ presentation }) =>({
      TEXT: 'ProfileFieldTextConfigs',
      SELECT: 'ProfileFieldSelectConfigs',
      DATE: 'ProfileFieldDateConfigs',
      SWITCH: 'ProfileFieldDefaultConfigs',
    })[presentation],
  },

  ProfileFieldValueData: {
    __resolveType: ({ presentation }) =>({
      TEXT: 'ProfileFieldTextValue',
      SELECT: 'ProfileFieldSelectValue',
      DATE: 'ProfileFieldDateValue',
      SWITCH: 'ProfileFieldSwitchValue',
    })[presentation],
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const fieldsQuery = gql`
  query($id: ID!) {
    user: node(id: $id) {
      id
      ...on User {
        profile {
          accountType {
            id
            fields {
              id
              ...ProfileFieldInput_field
            }
          }
        }
      }
    }
  }

  ${ProfileFieldInput.fragments.field}
`;

const valuesQuery = gql`
  query($id: ID!) {
    user: node(id: $id) {
      id
      ...on User {
        profile {
          values {
            id
            field {
              id
            }

            ...ProfileFieldInput_value
          }
        }
      }
    }
  }

  ${ProfileFieldInput.fragments.value}
`;

const Field = ({ userId: id, fieldId }) => (
  <Query query={fieldsQuery} variables={{ id }}>
    {({ data: fieldsData, loading }) => !loading && (
      <Query query={valuesQuery} variables={{ id }}>
        {({ data: valuesData, loading }) => {
          const field = find(fieldsData.user.profile.accountType.fields, { id: fieldId });
          const value = loading
            ? undefined
            : find(valuesData.user.profile.values, ['field.id', fieldId]) || null;

          return (
            <ProfileFieldInput
              field={field}
              value={value}
              onChange={action('onChange')}
              onError={action('onError')}
            />
          );
        }}
      </Query>
    )}
  </Query>
);

const getUserId = () => select('Value', {
  'Has value': 'User:1',
  'No value': 'User:2',
  'Async value': 'User:3',
}, 'User:1');

// Stories
stories.add('Text', () => <Field userId={getUserId()} fieldId="Field:1" />);
stories.add('Password', () => <Field userId={getUserId()} fieldId="Field:2" />);
stories.add('Select', () => <Field userId={getUserId()} fieldId="Field:3" />);
stories.add('Multi-Select', () => <Field userId={getUserId()} fieldId="Field:4" />);
stories.add('Multi-line', () => <Field userId={getUserId()} fieldId="Field:5" />);
stories.add('Date', () => <Field userId={getUserId()} fieldId="Field:6" />);
stories.add('Switch', () => <Field userId={getUserId()} fieldId="Field:7" />);
stories.add('Email', () => <Field userId={getUserId()} fieldId="Field:8" />);
stories.add('Url', () => <Field userId={getUserId()} fieldId="Field:9" />);
