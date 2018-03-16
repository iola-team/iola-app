import React, { Component } from 'react';
import { isArray, identity } from 'lodash';
import { compose, mapProps, branch } from 'recompose';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectStyle } from 'native-base';
import { ThemeShape } from '@shoutem/theme/src/Theme'

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

const withHotReload = (componentName) => (WrappedComponent) => (
  class HotReload extends WrappedComponent {
    getOrSetStylesInCache(context, props, styleNames, path) {
      return this.resolveStyle(context, props, styleNames);
    }

    forceUpdate(...args) {
      const theme = this.context.theme;

      /**
      * Clear internal cache
      */
      delete theme['@@shoutem.theme/themeCachedStyle'][componentName];

      const style = this.getFinalStyle(
        this.props,
        this.context,
        this.props.style,
        this.state.styleNames
      );

      this.setState({
        style,
      });
    }
  }
);

export default (name, defaultStyle, mapPropsToVariant) => compose(
  module.hot ? withHotReload(name, defaultStyle) : identity,

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
