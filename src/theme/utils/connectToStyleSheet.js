import { get, identity, isFunction, isObject, isString, merge } from "lodash"
import { compose, getContext, mapProps, withProps } from 'recompose'

import { contextShape } from './withStyleSheet'
import normalizeStyle from './normalizeStyle';
import composeStyles from './composeStyles';

export default (connector, WrappedComponent, ...componentStyles) => {
  const { staticStyles, getDynamicStyles } = composeStyles(...componentStyles);

  const ConnectedComponent = compose(
    getContext(contextShape),

    mapProps(({ styleSheet, ...props }) => {
      const styleList = [];
      let connectedProps = {};
      let currentConnector = connector;
      const dynamicStyles = getDynamicStyles(props, styleSheet);

      if (isFunction(connector)) {
        const connectionResult = connector(styleSheet, props, {
          dynamicStyles,
          staticStyles,
        });

        if (isString(connectionResult)) {
          currentConnector = connectionResult;
        } else if (isObject(connectionResult)) {
          connectedProps = connectionResult;
        }
      }

      if (isString(currentConnector)) {
        styleList.push(staticStyles);
        styleList.push(get(styleSheet, currentConnector));
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
   * Add custom static methods to connected component, like `withProps`
   */
  ConnectedComponent.withProps = (props) => withProps(props)(ConnectedComponent);

  return ConnectedComponent;
};
