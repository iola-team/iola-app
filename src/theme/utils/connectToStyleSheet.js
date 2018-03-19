import { get, identity, isFunction, isString, merge } from "lodash"
import { compose, getContext, mapProps, withProps } from 'recompose'

import { contextShape } from './withStyleSheet'
import normalizeStyle from './normalizeStyle';

const marshalExtraStyles = (styles) => {
  return styles.reduce((s, item) => {
    if (isFunction(item)) {
      const prev = s.getDynamicStyles;
      s.getDynamicStyles = (...args) => ({
        ...(prev(...args) || {}),
        ...(item(...args) || {}),
      });
    } else {
      s.staticStyles = merge(s.staticStyles || {}, item);
    }

    return s;
  }, {
    staticStyles: null,
    getDynamicStyles: () => (null),
  });
};

export default (connector, WrappedComponent, ...componentStyles) => {
  const { staticStyles, getDynamicStyles } = marshalExtraStyles(componentStyles);

  const ConnectedComponent = compose(
    getContext(contextShape),

    mapProps(({ styleSheet, ...props }) => {
      const styleList = [];
      let connectedProps = {};
      const dynamicStyles = getDynamicStyles(props, styleSheet);

      if (isFunction(connector)) {
        connectedProps = connector(styleSheet, props, {
          dynamicStyles,
          staticStyles,
        });
      } else if (isString(connector)) {
        styleList.push(staticStyles);
        styleList.push(get(styleSheet, connector));
        styleList.push(dynamicStyles);
      }

      styleList.push(props.style);

      return identity({
        ...props,
        style: normalizeStyle(styleList),
        ...connectedProps,
      });
    }),
  )(WrappedComponent);

  /**
   * Add custom static methods to connected component, like `attrs`
   */
  ConnectedComponent.withProps = (props) => withProps(props)(ConnectedComponent);

  return ConnectedComponent;
};
