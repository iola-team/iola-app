import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isArray, identity } from 'lodash';
import { compose, getDisplayName } from 'recompose';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectStyle } from 'native-base';

import normalizeStyle from './normalizeStyle';

export const contextShape = {
  styleSheet: PropTypes.object,
};

const wrapToStyleSheet = () => (WrappedComponent) => {
  class StyleSheet extends Component {
    static displayName = `StyleSheet(${getDisplayName(WrappedComponent)})`;
    static childContextTypes = contextShape;

    wrappedInstance = null;

    getChildContext() {
      return {
        styleSheet: this.splitStyle(this.props.style).styleSheet,
      };
    }

    splitStyle(rawStyle) {
      const [styleSheet, ...restStyle] = isArray(rawStyle) ? rawStyle : [rawStyle];

      return {
        styleSheet:  styleSheet || {},
        style: normalizeStyle(restStyle),
      };
    }

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
      const props = {
        ...this.props,
        ...this.splitStyle(this.props.style),
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
      /**
       * Call parent method to store cache
       */
      super.getOrSetStylesInCache(context, props, styleNames, path);

      /**
       * Return fresh styles to make HMR working
       */
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

  return HotReload;
};

export default (name, defaultStyle, mapPropsToVariant) => compose(
  module.hot ? withHotReload(name) : identity,

  connectStyle(name, defaultStyle, mapPropsToVariant),
  wrapToStyleSheet(),
);
