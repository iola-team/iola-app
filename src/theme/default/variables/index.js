import { assign } from 'lodash';
import defaultVariables from 'native-base/src/theme/variables/platform';

export default assign(defaultVariables, {
  androidRippleColor: 'rgba(200, 200, 200, 0.7)',
  backgroundColor: '#F8F9FB',
  badgeBg: '#FD5A5C',
  brandPrimary: '#5259FF',
  buttonBorderColor: '#FFFFFF',
  cardDefaultBg: 'transparent',
  foregroundColor: '#FFFFFF',
  highlightColor: '#F8F9FB',
  placeholderColor: '#FFFFFF',
  textColor: '#35373E',
  titleFontColor: '#35373E',
  toolbarDefaultBg: 'transparent',
  toolbarInputColor: '#F8F9FB',

  borderRadiusBase: 8,
  btnUppercaseAndroidText: false,
  contentPadding: 16,
  fontSizeBase: 16,
  fontSizeH1: 30,
  inputFontSize: 14,
});
