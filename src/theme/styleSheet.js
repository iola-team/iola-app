import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isArray, identity, isString, isFunction, isObject, get, merge } from 'lodash';
import { compose, mapProps, branch, toClass, getDisplayName, getContext, withProps } from 'recompose';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectStyle } from 'native-base';

const normalizeStyle = style => style.length === 1 ? style[0] : style;

const contextShape = {
  styleSheet: PropTypes.object,
};

const wrapToStyleSheet = () => (WrappedComponent) => {
  class StyleSheet extends Component {
    static displayName = `StyleSheet(${getDisplayName(WrappedComponent)})`;
    static childContextTypes = contextShape;

    wrappedInstance = null;
    state = {
      styleSheet: {},
      style: null,
    };

    constructor(props, context) {
      super(props, context);

      this.state = this.splitStyle(props.style);
    }

    getChildContext() {
      return {
        styleSheet: this.state.styleSheet,
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

    splitStyle(rawStyle) {
      const [styleSheet, ...restStyle] = isArray(rawStyle) ? rawStyle : [rawStyle];

      return {
        styleSheet:  styleSheet || {},
        style: normalizeStyle(restStyle),
      };
    }

    componentWillReceiveProps({ style }) {
      this.setState(this.splitStyle(style));
    }

    render() {
      const props = {
        ...this.props,
        ...this.state,
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


// Exports

export const withStyle = connectStyle;
export const connectToStyleSheet = (connector, WrappedComponent, defaultStyle, dynamicStyles = null) => {
  const ConnectedComponent = compose(
    getContext(contextShape),

    mapProps(({ styleSheet, ...props }) => {
      const styleList = [];
      const style = isFunction(connector) ? connector(styleSheet, props) : get(styleSheet, connector);

      styleList.push(merge({}, defaultStyle, style || {}));

      if (dynamicStyles) {
        styleList.push(
          isFunction(dynamicStyles) ? dynamicStyles(props) : dynamicStyles
        );
      }

      if (props.style) {
        styleList.push(props.style);
      }

      return identity({
        ...props,
        style: normalizeStyle(styleList),
      });
    }),
  )(WrappedComponent);

  /**
   * Add custom static methods to connected component, like `attrs`
   */
  ConnectedComponent.withProps = (props) => withProps(props)(ConnectedComponent);

  return ConnectedComponent;
};

export const withStyleSheet = (name, defaultStyle, mapPropsToVariant) => compose(
  module.hot ? withHotReload(name) : identity,

  connectStyle(name, defaultStyle, mapPropsToVariant),
  wrapToStyleSheet(),
);

export default {
  withStyleSheet,
  withStyle,
  connectToStyleSheet,
}
