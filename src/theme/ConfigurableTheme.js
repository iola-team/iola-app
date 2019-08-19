import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Theme from './Theme';

const variablesFragment = gql`
  fragment ConfigurableTheme_variables on Config {
    brandPrimary: primaryColor
  }
`;

const query = gql`
  query ThemeConfigsQuery {
    config {
      ...ConfigurableTheme_variables
    }
  }

  ${variablesFragment}
`;

const withVariables = graphql(query, {
  props: ({ data, variables = {} }) => ({ variables: { ...variables, ...(data?.config || {})}}),
});

const ConfigurableTheme = withVariables(Theme);
ConfigurableTheme.fragments = {
  variables: variablesFragment,
};

export default ConfigurableTheme;
