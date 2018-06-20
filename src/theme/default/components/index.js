import { merge, forEach } from 'lodash';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'Sparkle.TouchableOpacity': {
      '.disabled': {
        opacity: 0.3,
      },

      'NativeBase.Icon': {},
    },

    'NativeBase.Container': {
      backgroundColor: '#FFFFFF',
    },

    'NativeBase.ViewNB': {
      '.padder': {
        padding: variables.contentPadding,
      },

      '.horizontalPadder': {
        paddingHorizontal: variables.contentPadding,
      },

      '.verticalPadder': {
        paddingVertical: variables.contentPadding,
      },

      '.highlight': {
        backgroundColor: '#F8F9FB',
      },
    },

    'NativeBase.Item': {
      '.last': {
        borderWidth: 0,
      }
    },

    'NativeBase.Thumbnail': {
      '.small': {
        borderRadius: 4,
      },

      '.large': {
        borderRadius: 8,
      },

      width: 40,
      height: 40,
      borderRadius: 8,
    },

    'NativeBase.Button': {
      elevation: 0,
      height: 50,

      'NativeBase.Text': {
        fontSize: 16,
        fontWeight: '500',
      },

      '.transparent': {
        '.secondary': {
          backgroundColor: null,
        },

        '.disabled': {
          backgroundColor: null,
          opacity: 0.3,
        }
      },

      '.bordered': {
        '.secondary': {
          backgroundColor: null,
        }
      },

      '.light': {
        'NativeBase.Text': {
          color: variables.textColor,
        },
      },

      '.secondary': {
        borderColor: '#BDC0CB',
        backgroundColor: variables.brandLight,

        'NativeBase.Text': {
          color: variables.textColor,
        },

        '.bordered': {
          'NativeBase.Text': {
            color: variables.textColor,
          },
        },

        '.transparent': {
          'NativeBase.Text': {
            color: variables.textColor,
          },
        }
      },
    },

    'NativeBase.H1': {
      fontWeight: '500',
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.H2': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.H3': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.Text': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.Header': {
      'NativeBase.Body': {
        alignItems: 'center',
      },
    },

    'NativeBase.ListItem': {
      '.searchBar': {
        paddingHorizontal: variables.listItemPadding + 5,
        backgroundColor: 'transparent',

        'NativeBase.Item': {
          padding: 10,
          borderRadius: variables.borderRadiusBase,
          backgroundColor: variables.toolbarInputColor,
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
      },
    },

    'NativeBase.Card': {
      borderWidth: 0,
      marginBottom: 16,

      'NativeBase.CardItem': {
        padding: 0,

        '.header': {
          alignItems: 'center',

          'NativeBase.Text': {
            fontWeight: null,
            color: '#BDC0CB',
          },

          'NativeBase.Icon': {
            width: 30,
            fontSize: 20,
            color: '#BDC0CB',
          },
        },

        '.padder': {
          padding: variables.contentPadding,
        },

        '.horizontalPadder': {
          paddingHorizontal: variables.contentPadding,
        },

        '.highlight': {
          backgroundColor: '#F8F9FB',
        },

        '.cardBody': {
          flexDirection: 'column',
        }
      },

      '.topBorder': {
        borderTopWidth: variables.borderWidth,
      },
    },

    'Sparkle.Divider': {},

    'Sparkle.UserListItem': {
      'NativeBase.ListItem': {
        'NativeBase.Body': {
          height: 68,
          justifyContent: 'center',
        },
        'NativeBase.Right': {
          justifyContent: 'center',
        },
      },
    },

    'Sparkle.ScreenHeader': {
      'NativeBase.Icon': {
        fontSize: 35,
        color: '#BDC0CB',
        margin: 16,
        marginRight: 22,
      }
    },
  }),
}));
