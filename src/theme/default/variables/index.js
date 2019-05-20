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
  listBorderColor: 'rgba(189,192,203, 0.5)',
  btnDisabledBg: '#E8EAF0',

  borderRadiusBase: 8,
  btnUppercaseAndroidText: false,
  contentPadding: 16,
  fontSizeBase: 16,
  fontSizeH1: 30,
  inputFontSize: 14,
  listItemPadding: 11, // Native base adds 5 px internally, so the result value is 16 px
});
