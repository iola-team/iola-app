import React from 'react';
import { find, union, uniqueId } from 'lodash';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { button, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import delay from 'promise-delay';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import FieldForm from './FieldForm';

const stories = storiesOf('Components/FieldForm', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

const sections = [
  {
    id: 'Section:1',
    label: 'Basic Information',
  },
  {
    id: 'Section:2',
    label: 'About me',
  },
  {
    id: 'Section:3',
    label: 'Other information',
  },
];

const fields = [
  {
    id: 'Field:1',
    name: 'username',
    label: 'Username',
    presentation: 'TEXT',
    isRequired: true,
    section: find(sections, { id: 'Section:1' }),
    configs: {
      presentation: 'TEXT',
      isEmail: null,
      isUrl: null,
      multiline: null,
      secure: null,
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
    section: find(sections, { id: 'Section:1' }),
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: null,
      secure: true,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:3',
    name: 'realname',
    label: 'Real Name',
    presentation: 'TEXT',
    isRequired: true,
    section: find(sections, { id: 'Section:2' }),
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: null,
      secure: null,
      regexp: '^[a-zA-Z\\s]+$',
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:4',
    name: 'gender',
    label: 'Gender',
    presentation: 'SELECT',
    isRequired: true,
    section: find(sections, { id: 'Section:2' }),
    configs: {
      presentation: 'SELECT',
      multiple: null,
      options: [
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ],
    },
  },
  {
    id: 'Field:5',
    name: 'food',
    label: 'Favourite food',
    presentation: 'SELECT',
    isRequired: true,
    section: find(sections, { id: 'Section:2' }),
    configs: {
      presentation: 'SELECT',
      multiple: true,
      options: [
        { label: 'Tacos', value: '1' },
        { label: 'Kebab', value: '2' },
        { label: 'Pizza', value: '3' },
        { label: 'Pasta', value: '4' },
        { label: 'Avocados', value: '5' },
      ],
    },
  },
  {
    id: 'Field:6',
    name: 'description',
    label: 'Description',
    presentation: 'TEXT',
    isRequired: false,
    section: find(sections, { id: 'Section:3' }),
    configs: {
      presentation: 'TEXT',
      format: null,
      multiline: true,
      secure: null,
      regexp: null,
      minLength: 0,
      maxLength: 200,
    },
  },
  {
    id: 'Field:7',
    name: 'birthdate',
    label: 'Birthdate',
    presentation: 'DATE',
    isRequired: true,
    section: find(sections, { id: 'Section:3' }),
    configs: {
      presentation: 'DATE',
      minDate: new Date('1980'),
      maxDate: new Date(),
    },
  },
  {
    id: 'Field:8',
    name: 'tos',
    label: 'I agree',
    presentation: 'SWITCH',
    isRequired: true,
    section: find(sections, { id: 'Section:3' }),
    configs: {
      presentation: 'SWITCH',
    },
  },
  {
    id: 'Field:9',
    name: 'email',
    label: 'Email',
    presentation: 'TEXT',
    isRequired: true,
    section: find(sections, { id: 'Section:1' }),
    configs: {
      presentation: 'TEXT',
      format: 'EMAIL',
      multiline: null,
      secure: null,
      regexp: null,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    id: 'Field:10',
    name: 'url',
    label: 'Url',
    presentation: 'TEXT',
    isRequired: true,
    section: find(sections, { id: 'Section:1' }),
    configs: {
      presentation: 'TEXT',
      format: 'URL',
      multiline: null,
      secure: null,
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
      value: 'rroman',
    },
  },
  {
    id: 'Value:2',
    field: find(fields, { id: 'Field:2' }),
    data: {
      presentation: 'TEXT',
      value: '1234',
    },
  },
  {
    id: 'Value:3',
    field: find(fields, { id: 'Field:3' }),
    data: {
      presentation: 'TEXT',
      value: 'Roman Banan',
    },
  },
  {
    id: 'Value:4',
    field: find(fields, { id: 'Field:4' }),
    data: {
      presentation: 'SELECT',
      value: ['1'],
    },
  },
  {
    id: 'Value:5',
    field: find(fields, { id: 'Field:5' }),
    data: {
      presentation: 'SELECT',
      value: ['2', '3'],
    },
  },
  {
    id: 'Value:6',
    field: find(fields, { id: 'Field:6' }),
    data: {
      presentation: 'TEXT',
      value: 'Roman is a good boy',
    },
  },
  {
    id: 'Value:7',
    field: find(fields, { id: 'Field:7' }),
    data: {
      presentation: 'DATE',
      value: new Date('1988'),
    },
  },
  {
    id: 'Value:8',
    field: find(fields, { id: 'Field:8' }),
    data: {
      presentation: 'SWITCH',
      value: true,
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
  sections,
  values,
};

const typeDefs = gql`
  scalar Date
  
  type Mutation {
    saveProfileFieldValues(input: ProfileFieldSaveInput!): ProfileFieldSavePayload!
  }
  
  type Query {
    node(id: ID!): User!
  }

  input ProfileFieldValueInput {
    fieldId: ID!

    booleanValue: Boolean
    stringValue: String
    arrayValue: [String!]
    dateValue: Date
  }

  input ProfileFieldSaveInput {
    userId: ID!
    values: [ProfileFieldValueInput!]!
  }

  type ProfileFieldSavePayload {
    user: User!
    nodes: [ProfileFieldValue!]!
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
  Mutation: {
    saveProfileFieldValues: (root, { input }, { dataStore }) => {
      const { userId, values } = input;

      let nextId = dataStore.values.length;
      const nodes = values.map(({ fieldId, ...data }) => {
        const field = find(dataStore.fields, { id: fieldId});

        const value = find(dataStore.values, ['field.id', fieldId]) || {
          id: `Value:${++nextId}`,
          field: field,
          data: {
            presentation: field.presentation,
            value: null,
          },
        };

        value.data.value = Object.values(data)[0];

        return value;
      });

      dataStore.values = union(dataStore.values, nodes);

      return {
        nodes: [
          ...nodes,
        ],
        user: find(dataStore.users, { id: userId}),
      };
    },
  },

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
              ...FieldForm_field
            }
          }
        }
      }
    }
  }
  
  ${FieldForm.fragments.field}
`;

const valuesQuery = gql`
  query($id: ID!) {
    user: node(id: $id) {
      id
      ...on User {
        profile {
          values {
            id
            ...FieldForm_value
          }
        }
      }
    }
  }

  ${FieldForm.fragments.value}
`;

const mutationQuery = gql`
  mutation($input: ProfileFieldSaveInput!) {
    saveProfileFieldValues(input: $input) {
      user {
        id
      }

      nodes {
        id
        ...FieldForm_value
      }
    }
  }

  ${FieldForm.fragments.value}
`;

const WithData = ({ userId: id }) => {
  let form;

  button('Submit', () => {
    form._root.submit();
  });

  return (
    <Query query={fieldsQuery} variables={{ id }}>
      {({ data: fieldsData, loading }) => !loading && (
        <Query query={valuesQuery} variables={{ id }}>
          {({ data: valuesData, loading }) => (
            <Mutation mutation={mutationQuery} onCompleted={action('onMutationComplete')}>
              {(mutate) => (
                <FieldForm
                  ref={r => form = r}
                  fields={fieldsData.user.profile.accountType.fields}
                  values={loading ? undefined : valuesData.user.profile.values}
                  onSubmit={(values) => {
                    action('onSubmit')(values);

                    return mutate({
                      variables: {
                        input: {
                          userId: id,
                          values: values,
                        },
                      },
                    });
                  }}
                />
              )}
            </Mutation>
          )}
        </Query>
      )}
    </Query>
  );
};

// Stories
stories.add('With filled data', () => <WithData userId="User:1" />);
stories.add('No data', () => <WithData userId="User:2" />);
stories.add('With async data', () => <WithData userId={'User:3'} />);
stories.add('Loading data', () => {
  const id = 'User:1';

  return (
    <Query query={fieldsQuery} variables={{ id }} pollInterval={1000}>
      {({ data: fieldsData, loading }) => !loading && (
        <FieldForm
          fields={fieldsData.user.profile.accountType.fields}
          values={undefined}
          onSubmit={action('onSubmit')}
        />
      )}
    </Query>
  );
});
