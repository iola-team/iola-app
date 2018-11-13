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
      ...item
    };
  }

  return s;
}, {
  staticStyles: {},
  getDynamicStyles: () => (null),
});
