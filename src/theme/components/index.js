import { merge, forEach } from 'lodash';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'NativeBase.Thumbnail': {
      borderRadius: 10,
    },

    'NativeBase.Button': {
      'NativeBase.Text': {
        fontWeight: '500',
      },

      elevation: 0,
      height: 50,
    },

    'NativeBase.H1': {
      fontWeight: '500',
    },

    'Sparkle.Divider': {},
  }),
}));
