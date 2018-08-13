import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType as fragmentProp } from 'graphql-anywhere';
import gql from 'graphql-tag';
import { View as ViewRN } from 'react-native';
import { groupBy, map } from 'lodash'

import Section from './FieldListSection';

const renderSection = ({ key, label, items }, renderItem) => (
  <Section key={key} label={label}>
    {items.map(renderItem)}
  </Section>
);

export default class FieldList extends Component {
  static propTypes = {
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired,
      }).isRequired,
    ).isRequired,

    renderItem: PropTypes.func.isRequired,
    renderSection: PropTypes.func,
  };

  static defaultProps = {
    renderSection,
  };

  renderItem = (field, index) => this.props.renderItem(field, index);
  renderSection = ({ key, ...rest }, index) => this.props.renderSection({
    key: index,
    ...rest,
  }, this.renderItem);

  render() {
    const { style, sections } = this.props;

    return (
      <ViewRN style={style}>
        {
          sections.map(::this.renderSection)
        }
      </ViewRN>
    );
  }
}
