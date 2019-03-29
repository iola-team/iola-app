import { assign } from 'lodash';
import defaultVariables from 'native-base/src/theme/variables/platform';

export default assign(defaultVariables, {
  btnUppercaseAndroidText: false,
  borderRadiusBase: 8,
  fontSizeH1: 30,
  brandPrimary: '#5259FF',
  fontSizeBase: 16,
  toolbarDefaultBg: 'transparent',
  titleFontColor: '#45474F',
  toolbarInputColor: '#F8F9FB',
  inputFontSize: 14,
  textColor: '#585A61',
  contentPadding: 16,
  androidRippleColor: "rgba(200, 200, 200, 0.7)",
  containerBgColor: '#F8F9FB',
  highlightColor: '#FFFFFF',
});
