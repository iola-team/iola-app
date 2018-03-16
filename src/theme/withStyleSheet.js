import React, { Component } from 'react';
import { isArray, identity } from 'lodash';
import { compose, mapProps, branch, toClass, getDisplayName } from 'recompose';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectStyle } from 'native-base';

const withStyleSheet = () => (WrappedComponent) => {
  class StyleSheet extends Component {
    static displayName = `StyleSheet(${getDisplayName(WrappedComponent)})`;

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

    render() {
      const [styleSheet, ...style] = isArray(this.props.style)
        ? this.props.style
        : [this.props.style];

      const props = {
        ...this.props,
        style,
        styleSheet,
        ref: (cmp) => {
          this.wrappedInstance = cmp;
        },
      };

      return <WrappedComponent {...props} />;
    }
  }

  return hoistNonReactStatic(StyleSheet, WrappedComponent);
};

const withHotReload = componentName => (WrappedComponent) => {
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

  return hoistNonReactStatic(HotReload, WrappedComponent);
};

export default (name, defaultStyle, mapPropsToVariant) => compose(
  module.hot ? withHotReload(name) : identity,

  connectStyle(name, defaultStyle, mapPropsToVariant),
  withStyleSheet(),
);
