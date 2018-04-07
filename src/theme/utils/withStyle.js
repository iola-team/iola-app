import composeStyles from './composeStyles';
import normalizeStyle from './normalizeStyle';
import { connectStyle } from 'native-base';
import { withProps, compose, hoistStatics } from 'recompose';
import mapPropsToStyleNames from 'native-base/src/Utils/mapPropsToStyleNames';

export default (componentName, ...componentStyles) => {
  const { staticStyles, getDynamicStyles } = composeStyles(...componentStyles);

  return hoistStatics(
    compose(
      withProps((props) => ({
        ...props,
        style: normalizeStyle([props.style, getDynamicStyles(props)]),
      })),
      connectStyle(componentName, staticStyles || {}, mapPropsToStyleNames),
    )
  );
}
