import { isFunction, merge } from 'lodash';

export default (...styles) => styles.reduce((s, item) => {
  if (isFunction(item)) {
    const prev = s.getDynamicStyles;
    s.getDynamicStyles = (...args) => ({
      ...(prev(...args) || {}),
      ...(item(...args) || {}),
    });
  } else {
    const prev = s.staticStyles || {};
    s.staticStyles = {
      ...prev,
      ...item,
    };
  }

  return s;
}, {
  staticStyles: {
    /**
     * TODO: dirty fix. 
     * Need to resolve in future.
     * It fixes an issue with NativeBase theme, when you have to specify atleast on style rule 
     * when connecting a custom component with `connectStyle`.
     */
    'dirty.fix': null,
  },
  getDynamicStyles: () => (null),
});
