import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { MockList } from 'graphql-tools';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import FieldForm from './FieldForm';
import delay from 'promise-delay'

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
    isRequired: true,
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

const users = [
  {
    id: 'User:1',
    profile: {
      accountType: {
        id: 'AccountType:1',
        fields,
      }
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
      RANGE: 'ProfileFieldDefaultConfigs',
    })[presentation],
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const userQuery = gql`
  query {
    user: node(id: "User:1") {
      id
      ...FieldForm_user
    }
  }
  
  ${FieldForm.fragments.user}
`;

// Stories
stories.add('Default', () => {
  const something = number('Some number', 0);

  return (
    <Query query={userQuery}>
      {({ data, loading }) => !loading && (

        <FieldForm
          user={data.user}
        />

      )}
    </Query>
  );
});
