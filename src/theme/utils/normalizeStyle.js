import { isArray, isPlainObject } from "lodash";

/**
 * TODO: very dirty hack
 * The function removes `dirty.fix` property added in `composeStyle.js`
 */
const removeDirtyFix = (style) => {
  if (isPlainObject(style)) {
    delete style['dirty.fix'];
  }

  return isArray(style) ? style.map(removeDirtyFix) : style;
};

export default (rawStyle) => {
  if (isPlainObject(rawStyle)) {
    return rawStyle;
  }

  const style = rawStyle.filter(item => isArray(item) ? item.length : item);

  if (style.length) {
    return removeDirtyFix(style.length === 1 ? style[0] : style);
  }

  return null;
};
