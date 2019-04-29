import { assign } from 'lodash';
import defaultVariables from 'native-base/src/theme/variables/platform';

export default assign(defaultVariables, {
  androidRippleColor: 'rgba(200, 200, 200, 0.7)',
  backgroundColor: '#F3F4F7',
  badgeBg: '#FD5A5C',
  brandPrimary: '#5259FF',
  buttonBorderColor: '#FFFFFF',
  cardDefaultBg: 'transparent',
  foregroundColor: '#FFFFFF',
  highlightColor: '#F3F4F7',
  placeholderColor: '#FFFFFF',
  textColor: '#35373E',
  titleFontColor: '#35373E',
  toolbarDefaultBg: 'transparent',
  toolbarInputColor: '#F3F4F7',

  borderRadiusBase: 8,
  btnUppercaseAndroidText: false,
  contentPadding: 16,
  fontSizeBase: 16,
  fontSizeH1: 30,
  inputFontSize: 14,
});
