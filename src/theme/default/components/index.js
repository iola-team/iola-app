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

    'NativeBase.Header': {
      'NativeBase.Body': {
        alignItems: 'center',
      },
    },

    'NativeBase.ListItem': {
      '.searchBar': {
        'NativeBase.Item': {
          backgroundColor: variables.toolbarInputColor,
          borderRadius: variables.borderRadiusBase,
          padding: 10,

          shadowColor: '#E1E6ED',
          shadowRadius: 4,
          shadowOpacity: 1,
          shadowOffset: {
            width: 0,
            height: 0,
          },

          'NativeBase.Icon': {
            color: '#BDC0CB',
          },
        },
        paddingHorizontal: variables.listItemPadding + 5,
        backgroundColor: 'transparent',
      },
    },

    'Sparkle.Divider': {},
  }),
}));
