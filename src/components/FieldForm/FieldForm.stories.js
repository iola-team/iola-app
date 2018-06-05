import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, button, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import delay from 'promise-delay'

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
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
  }
];

const fields = [
  {
    id: 'Field:1',
    name: 'username',
    label: 'Username',
    presentation: 'TEXT',
    isRequired: true,
    section: find(sections, { id: 'Section:1'}),
    configs: {
      presentation: 'TEXT',
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
    section: find(sections, { id: 'Section:1'}),
    configs: {
      presentation: 'TEXT',
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
    section: find(sections, { id: 'Section:2'}),
    configs: {
      presentation: 'TEXT',
      multiline: null,
      secure: null,
      regexp: null,
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
    section: find(sections, { id: 'Section:2'}),
    configs: {
      presentation: 'SELECT',
      multiple: null,
      options: [
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ]
    },
  },
  {
    id: 'Field:5',
    name: 'food',
    label: 'Favourite food',
    presentation: 'SELECT',
    isRequired: true,
    section: find(sections, { id: 'Section:2'}),
    configs: {
      presentation: 'SELECT',
      multiple: true,
      options: [
        { label: 'Tacos', value: '1' },
        { label: 'Kebab', value: '2' },
        { label: 'Pizza', value: '3' },
        { label: 'Pasta', value: '4' },
        { label: 'Avocados', value: '5' },
      ]
    },
  },
  {
    id: 'Field:6',
    name: 'description',
    label: 'Description',
    presentation: 'TEXT',
    isRequired: false,
    section: find(sections, { id: 'Section:3'}),
    configs: {
      presentation: 'TEXT',
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
    section: find(sections, { id: 'Section:3'}),
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
    section: find(sections, { id: 'Section:3'}),
    configs: {
      presentation: 'SWITCH',
    },
  },
];

const values = [
  {
    id: 'Value:1',
    field: find(fields, { id: 'Field:1'}),
    data: {
      presentation: 'TEXT',
      value: 'rroman',
    },
  },
  {
    id: 'Value:2',
    field: find(fields, { id: 'Field:2'}),
    data: {
      presentation: 'TEXT',
      value: '1234',
    },
  },
  {
    id: 'Value:3',
    field: find(fields, { id: 'Field:3'}),
    data: {
      presentation: 'TEXT',
      value: 'Roman Banan',
    },
  },
  {
    id: 'Value:4',
    field: find(fields, { id: 'Field:4'}),
    data: {
      presentation: 'SELECT',
      value: ['1'],
    },
  },
  {
    id: 'Value:5',
    field: find(fields, { id: 'Field:5'}),
    data: {
      presentation: 'SELECT',
      value: ['2', '3'],
    },
  },
  {
    id: 'Value:6',
    field: find(fields, { id: 'Field:6'}),
    data: {
      presentation: 'TEXT',
      value: 'Roman is a good boy',
    },
  },
  {
    id: 'Value:7',
    field: find(fields, { id: 'Field:7'}),
    data: {
      presentation: 'DATE',
      value: new Date('1988'),
    },
  },
  {
    id: 'Value:8',
    field: find(fields, { id: 'Field:8'}),
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
      values,
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

  type ProfileFieldTextConfigs {
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

const WithData = ({ userId: id }) => {
  let form;

  button('Submit', () => {
    const result = form._root.submit();

    console.log('Submit result', result);
  });

  return (
    <Query query={fieldsQuery} variables={{ id }}>
      {({ data: fieldsData, loading }) => !loading && (
        <Query query={valuesQuery} variables={{ id }}>
          {({ data: valuesData, loading }) => (
            <FieldForm
              ref={r => form = r}
              fields={fieldsData.user.profile.accountType.fields}
              values={loading ? undefined : valuesData.user.profile.values}
              onSubmit={action('onSubmit')}
            />
          )}
        </Query>
      )}
    </Query>
  );
};

// Stories
stories.add('With filled data', () => {
  return (
    <WithData userId={'User:1'} />
  );
});

stories.add('No data', () => {
  return (
    <WithData userId={'User:2'} />
  );
});

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

stories.add('With async data', () => {
  return (
    <WithData userId={'User:3'} />
  );
});
