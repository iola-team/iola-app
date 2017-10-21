import { connect } from 'react-redux';
import { graphql, gql } from 'react-apollo';

import Sidebar from './Sidebar';
import { startAuthentication } from '../../../application/ducks'

const userQuery = gql`
query userById ($id: ID!) {
  User(id: $id) {
    id,
    name,
    email,
    password
  }
}
`;

const SidebarWithData = graphql(userQuery, {
  props: ({ data }) => ({
    user: data.User,
    loading: data.loading
  }),

  options: (props) => ({
    variables: {
      id: 'cj6jd7fk2kver0124unux3co3'
    }
  })
})(Sidebar);

const mapDispatchToProps = {
  signOut: startAuthentication
};

export default connect(null, mapDispatchToProps)(SidebarWithData);