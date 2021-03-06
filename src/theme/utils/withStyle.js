import { connectStyle } from 'native-base-shoutem-theme';
import { withProps, compose, toClass, hoistStatics } from 'recompose';

import mapPropsToStyleNames from 'native-base/src/utils/mapPropsToStyleNames';
import composeStyles from './composeStyles';
import normalizeStyle from './normalizeStyle';

export default (componentName, ...componentStyles) => {
  const { staticStyles, getDynamicStyles } = composeStyles(...componentStyles);

  return hoistStatics(
    compose(
      connectStyle(componentName, staticStyles, mapPropsToStyleNames),
      toClass,
      withProps((props) => ({
        ...props,
        style: normalizeStyle([props.style, getDynamicStyles(props)]),
      })),
    )
  );
};
