import composeStyles from './composeStyles';
import normalizeStyle from './normalizeStyle';
import { connectStyle } from 'native-base';
import { withProps, compose, toClass } from 'recompose';
import mapPropsToStyleNames from 'native-base/src/Utils/mapPropsToStyleNames';

export default (componentName, ...componentStyles) => {
  const { staticStyles, getDynamicStyles } = composeStyles(...componentStyles);

  return compose(
    connectStyle(componentName, staticStyles, mapPropsToStyleNames),
    toClass,
    withProps((props) => ({
      ...props,
      style: normalizeStyle([props.style, getDynamicStyles(props)]),
    })),
  );
}
