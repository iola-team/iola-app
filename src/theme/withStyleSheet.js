import React, { Component } from 'react';
import { isArray } from 'lodash';
import { compose } from 'recompose';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectStyle } from 'native-base';

const componentName = Cmp => (Cmp.displayName || Cmp.name || "Component");

const withProps = (mapProps) => (WrappedComponent) => {
  class StyleSheet extends Component {
    static displayName = `StyleSheet(${componentName(WrappedComponent)})`;

    wrappedInstance = null;

    /**
     * Forward forceUpdate to the wrapped component
     * TODO: investigate a better workaround
     *
     * @param args
     */
    forceUpdate(...args) {
      if (this.wrappedInstance) {
        this.wrappedInstance.forceUpdate(...args);
      }
    }

    setWrappedInstance(component) {
      this._root = component && component._root
        ? component._root
        : component;

      this.wrappedInstance = this._root;
    }

    render() {
      return (
        <WrappedComponent
          {...mapProps(this.props)}
          ref={::this.setWrappedInstance}
        />
      );
    }
  }

  return hoistNonReactStatic(StyleSheet, WrappedComponent);
};

export default (name, defaultStyle, mapPropsToVariant) => compose(
  connectStyle(name, defaultStyle, mapPropsToVariant),

  withProps(({ style: styleProp, ...props }) => {
    const [styleSheet, ...style] = isArray(styleProp) ? styleProp : [styleProp]

    return {
      ...props,
      style,
      styleSheet,
    };
  })
);
