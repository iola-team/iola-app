import { isArray, isPlainObject } from "lodash"

const emptyStyle = {};
export default (rawStyle) => {
  if (isPlainObject(rawStyle)) {
    return rawStyle;
  }

  const style = rawStyle.filter(item => isArray(item) ? item.length : item);

  if (style.length) {
    return style.length === 1 ? style[0] : style;
  }

  return null;
};
