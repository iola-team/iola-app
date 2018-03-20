import { isArray, isObject } from "lodash"

export default (rawStyle) => {
  if (isObject(rawStyle)) {
    return rawStyle;
  }

  const style = rawStyle.filter(item => isArray(item) ? item.length : item);

  return style.length === 1 ? style[0] : style;
};
