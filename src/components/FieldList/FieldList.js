import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Section from '../FieldSection';
import { ScrollView } from '../TabNavigator';

const defaultSectionRenderer = ({ key, label, items }, renderItem) => (
  <Section key={key} label={label}>
    {items.map(renderItem)}
  </Section>
);

const sectionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
}).isRequired;

export default class FieldList extends Component {
  static propTypes = {
    sections: PropTypes.arrayOf(sectionShape).isRequired,
    renderItem: PropTypes.func.isRequired,
    renderSection: PropTypes.func,
  };

  static defaultProps = {
    renderSection: defaultSectionRenderer,
  };

  renderSection = ({ key, ...rest }, index) => {
    const { renderSection, renderItem } = this.props;

    return renderSection({ key: index, ...rest }, renderItem);
  }

  render() {
    const { style, sections } = this.props;

    return (
      <ScrollView style={style}>
        {
          sections.map(this.renderSection)
        }
      </ScrollView>
    );
  }
}
