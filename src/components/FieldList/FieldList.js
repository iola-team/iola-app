import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range, noop } from 'lodash';

import Section from '../FieldSection';
import { ScrollView } from '../TabNavigator';

const defaultSectionRenderer = (section, renderItem) => {
  const { key, label, items = [], placeholder = false } = section;

  return (
    <Section key={key} label={label} loading={placeholder}>
      {items.map(renderItem)}
    </Section>
  );
};

const sectionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
}).isRequired;

export default class FieldList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    sections: PropTypes.arrayOf(sectionShape),
    renderItem: PropTypes.func,
    renderSection: PropTypes.func,
    ListHeaderComponent: PropTypes.any,
  };

  static defaultProps = {
    renderItem: noop,
    sections: null,
    loading: false,
    renderSection: defaultSectionRenderer,
    ListHeaderComponent: null,
  };

  renderSection = ({ key, ...rest }, index) => {
    const { renderSection, renderItem } = this.props;

    return renderSection({ key: index, ...rest }, renderItem);
  }

  getPlaceholders = count => range(count).map(index => ({ 
    key: index.toString(),
    placeholder: true,
  }));

  render() {
    const { style, ListHeaderComponent, loading, sections, ...props } = this.props;
    const isLoaded = sections !== null;
    const data = !isLoaded && loading ? this.getPlaceholders(2) : sections;

    return (
      <ScrollView {...props} style={style}>
        {ListHeaderComponent}

        {
          data.map(this.renderSection)
        }
      </ScrollView>
    );
  }
}
