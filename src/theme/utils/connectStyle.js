import { withProps } from 'recompose';

import withStyle from './withStyle';

export default (componentName, WrappedComponent, ...componentStyles) => {
  const ConnectedComponent = withStyle(componentName, ...componentStyles)(WrappedComponent)

  /**
   * Add custom static methods to connected component, like `withProps`
   */
  ConnectedComponent.withProps = (props) => withProps(props)(ConnectedComponent);

  return ConnectedComponent;
}
