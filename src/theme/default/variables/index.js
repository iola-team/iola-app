import { assign } from 'lodash';
import defaultVariables from 'native-base/src/theme/variables/platform';

export default assign(defaultVariables, {
  btnUppercaseAndroidText: false,
  borderRadiusBase: 8,
  fontSizeH1: 30,
  brandPrimary: '#5259FF',
  fontSizeBase: 16,
  toolbarDefaultBg: 'transparent',
  titleFontColor: '#35373E',
  toolbarInputColor: '#F8F9FB',
  inputFontSize: 14,
  textColor: '#35373E',
  contentPadding: 16,
  androidRippleColor: "rgba(200, 200, 200, 0.7)",
  cardDefaultBg: 'transparent',
  badgeBg: '#FD5A5C',

  foregroundColor: '#FFFFFF',
  backgroundColor: '#F8F9FB',
  highlightColor: '#F8F9FB',
  placeholderColor: '#FFFFFF',
});
