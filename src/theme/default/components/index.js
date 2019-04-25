import { merge, forEach } from 'lodash';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'NativeBase.Container': {
      backgroundColor: variables.backgroundColor,
    },

    'Sparkle.TouchableOpacity': {
      '.disabled': {
        opacity: 0.3,
      },

      'NativeBase.Icon': {},

      '.primary': {
        'NativeBase.Text': {
          color: variables.brandPrimary,
        }
      },

      '.button': {
        justifyContent: 'center',
        height: 50,

        '.bordered': {
          borderWidth: 1,
          borderRadius: variables.borderRadiusBase,
          borderColor: variables.buttonBorderColor,

          'NativeBase.Text': {
            color: variables.buttonBorderColor,
          },
        },

        'NativeBase.Text': {
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '500',
          color: variables.textColor,
        },
      },
    },

    'NativeBase.Fab': {
      'NativeBase.Icon': {
        color: '#000000',
      },

      backgroundColor: variables.highlightColor,
      elevation: 5,
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
        backgroundColor: variables.highlightColor,
      },

      '.background': {
        backgroundColor: variables.backgroundColor,
      },

      '.foreground': {
        backgroundColor: variables.foregroundColor,
      },
    },

    'NativeBase.Item': {
      '.last': {
        borderWidth: 0,
      }
    },

    'NativeBase.Thumbnail': {
      width: 40,
      height: 40,
      borderRadius: variables.borderRadiusBase,

      '.small': {
        width: 32,
        height: 32,
        borderRadius: 6,
      },

      '.large': {
        borderRadius: variables.borderRadiusBase,
        height: 168,
        width: 168,
      },
    },

    'NativeBase.Button': {
      elevation: 0,
      height: 50,

      'Sparkle.Spinner': {
        position: 'absolute',
        right: variables.contentPadding,
        color: '#FFFFFF',
      },

      'NativeBase.Text': {
        fontSize: 16,
        fontWeight: '500',
      },

      '.primary': {
        '.disabled': {
          backgroundColor: '#5F96F2',
          opacity: 0.5,
        },
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

        'NativeBase.Icon': {
          color: variables.textColor,
        },

        '.bordered': {
          'NativeBase.Text': {
            color: variables.textColor,
          },

          'NativeBase.Icon': {
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
            fontSize: 18,
          },
        },
      },

      'NativeBase.Body': {
        'NativeBase.Text': {
          '.name': {
            fontWeight: '600',
          },

          '.headline': {
            lineHeight: 20,
            marginBottom: 5,
          },

          '.content': {
            color: '#AFB2BF',
            fontSize: 14,
          },
        },
      },

      'NativeBase.Right': {
        'NativeBase.Text': {
          color: '#AFB2BF',
          lineHeight: 20,
          marginBottom: 5,
          fontSize: 10,
        },

        'NativeBase.Badge': {
          height: null,
          minWidth: 18,
          paddingHorizontal: 2.5,

          'NativeBase.Text': {
            fontSize: 10,
            lineHeight: 11,
          },
        },
      },

      '.chatItem': {
        'NativeBase.Body': {
          paddingVertical: 15,
        },

        'NativeBase.Right': {
          paddingVertical: 15,
        },

        'NativeBase.Left': {
          paddingVertical: 15,
        },
      },
    },

    'NativeBase.Card': {
      borderWidth: 0,

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
          backgroundColor: variables.highlightColor,
        },

        '.background': {
          backgroundColor: variables.backgroundColor,
        },

        '.foreground': {
          backgroundColor: variables.foregroundColor,
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

    'Sparkle.Shadow': {},

    'Sparkle.ScreenHeader': {
      opaqueHeader: {
        backgroundColor: variables.foregroundColor,
      },

      transparentHeader: {
        backgroundColor: 'transparent',
      },

      'NativeBase.Icon': {
        fontSize: 35,
        color: '#BDC0CB',
        margin: 7,
      },

      'Sparkle.TouchableOpacity': {
        paddingHorizontal: variables.contentPadding,

        'NativeBase.Text': {
          color: '#BDC0CB',
        },
      },
    },


    'Sparkle.SearchBar': {
      inputWrap: {
        backgroundColor: variables.highlightColor,
      },
    },

    'Sparkle.TabBar': {},
    'Sparkle.BottomTabBar': {},

    'Sparkle.ChatFooter': {
      root: {
        backgroundColor: variables.foregroundColor,
      },
    },

    'Sparkle.NoContent': {
      'NativeBase.ViewNB': {
        backgroundColor: variables.placeholderColor,
      },

      '.inverted': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.foregroundColor,
        },
      },
    },

    /**
     * Placeholders
     * TODO: Think of a better approach ( more generic - less hardcoded )
     */
    'Sparkle.ChatListItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ListItem': {
          'NativeBase.Left': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },

          'NativeBase.Body': {
            'NativeBase.Text': {
              backgroundColor: variables.placeholderColor,
            },
          },
        },
      },
    },

    'Sparkle.FieldSection': {
      'Sparkle.Placeholder': {
        'NativeBase.Card': {
          'NativeBase.CardItem': {
            '.header': {
              'NativeBase.Text': {
                backgroundColor: variables.placeholderColor,
              },
            },

            '.cardBody': {
              'NativeBase.ViewNB': {
                backgroundColor: variables.placeholderColor,
              },
            },
          },
        },
      },
    },

    'Sparkle.PhotoListItem': {
      'Sparkle.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'Sparkle.UserAvatar': {
      'Sparkle.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'Sparkle.UserHeading': {
      'NativeBase.ViewNB': {
        'Sparkle.UserAvatar': {
          'Sparkle.Placeholder': {
            backgroundColor: variables.placeholderColor,
          },
        },
      },
    },

    'Sparkle.UserListItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ListItem': {
          'NativeBase.Left': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },

          'NativeBase.Body': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },
        },
      },
    },

    'Sparkle.UsersRowItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.highlightColor,
        },
      },
    },

    'Sparkle.RefreshControl': {
      color: variables.brandPrimary,
    },

    'Sparkle.AvatarInput': {
      imageHolder: {
        backgroundColor: variables.placeholderColor,
      },
    },
  }),
}));
