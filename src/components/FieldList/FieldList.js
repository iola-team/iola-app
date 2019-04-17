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
  };

  static defaultProps = {
    renderItem: noop,
    sections: [],
    loading: false,
    renderSection: defaultSectionRenderer,
  };

  renderSection = ({ key, ...rest }, index) => {
    const { renderSection, renderItem } = this.props;

    return renderSection({ key: index, ...rest }, renderItem);
  }

  getPlaceholders() {
    return range(2).map(index => ({ 
      key: index.toString(),
      placeholder: true,
    }));
  }

  render() {
    const { style, loading, sections, ...props } = this.props;
    const items = loading ? this.getPlaceholders() : sections;

    return (
      <ScrollView {...props} style={style}>
        {
          items.map(this.renderSection)
        }
      </ScrollView>
    );
  }
}
