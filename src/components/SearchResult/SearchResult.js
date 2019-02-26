import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import { get, noop, debounce } from 'lodash';
import { View } from 'native-base';

import { withStyleSheet } from 'theme';

const connectionFrgment = gql`
  fragment SearchResult_connection on Connection {
    edges {
      node {
        id
      }
    }

    totalCount
  }
`;


@withStyleSheet('Sparkle.SearchResult', {
  root: {
    flex: 1,
  }
})
@withApollo
export default class SearchResult extends Component {
  static fragments = {
    connection: connectionFrgment,
  };

  static propTypes = {
    connectionPath: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    filterEdges: PropTypes.func.isRequired,
    search: PropTypes.string,
    renderBlank: PropTypes.func,
    onSearchingStateChange: PropTypes.func,
  };

  static defaultProps = {
    search: '',
    renderBlank: noop,
    onSearchingStateChange: noop,
  };

  scheduledQueriesCount = 0;
  lastValidResult = null;

  sheduleQuery = debounce(async () => {
    const { client, search, onSearchingStateChange } = this.props;

    if (!search.length) {
      return;
    }

    if (this.scheduledQueriesCount++ === 0) {
      requestAnimationFrame(() => onSearchingStateChange(true));
    }

    try {
      await client.query({ ...this.getQueryOptions(), fetchPolicy: 'network-only' });
    } catch {
      // Do nonthing...
    }

    if (this.scheduledQueriesCount > 0 && --this.scheduledQueriesCount <= 0) {
      requestAnimationFrame(() => onSearchingStateChange(false));
    }
  }, 100);

  renderResult = ({ data }) => {
    const { search, filterEdges, children: renderList, connectionPath } = this.props;
    const unfilteredEdges = get(data, [connectionPath, 'edges'], this.lastValidResult);
    const edges = (unfilteredEdges || []).filter(edge => filterEdges(edge, search));
    const loading = unfilteredEdges === null;
    this.lastValidResult = unfilteredEdges;
    
    return !loading && renderList({
      edges,
    });
  }

  getQueryOptions() {
    const { query, search } = this.props;

    return {
      query,
      variables: { search, first: 50 },
    };
  }

  reset() {
    const { onSearchingStateChange } = this.props;

    this.lastValidResult = null;
    this.scheduledQueriesCount = 0;

    requestAnimationFrame(() => onSearchingStateChange(false));
  }

  shouldComponentUpdate({ search }) {
    return this.props.search !== search;
  }

  componentDidUpdate() {
    const { search } = this.props;

    if (search.length) {
      this.sheduleQuery();
    } else {
      this.reset();
    }
  }

  render() {
    const { styleSheet: styles, search, renderBlank } = this.props;
    
    return (
      <View style={styles.root}>
        {!search ? renderBlank() : (
          <Query {...this.getQueryOptions()} fetchPolicy='cache-only'>
            {this.renderResult}
          </Query>
        )}
      </View>
    );
  }
}
