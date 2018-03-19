import { isFunction, merge } from 'lodash'

export default (...styles) => {
  return styles.reduce((s, item) => {
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
        ...item
      };
    }

    return s;
  }, {
    staticStyles: null,
    getDynamicStyles: () => (null),
  });
};
