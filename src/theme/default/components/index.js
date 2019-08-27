import { merge } from 'lodash';
import { StyleSheet } from 'react-native';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'iola.LoadingScreen': {
      'NativeBase.Container': {
        'NativeBase.ViewNB': {
          'iola.Spinner': {
            color: variables.brandPrimary,
          },
        },
      },
    },

    'NativeBase.Container': {
      backgroundColor: variables.backgroundColor,
    },

    'iola.TouchableOpacity': {
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

    'iola.Thumbnail': {
      width: 40,
      height: 40,
      borderRadius: variables.borderRadiusBase,
      borderColor: '#E8EAF0',
      borderWidth: StyleSheet.hairlineWidth,

      '.small': {
        width: 32,
        height: 32,
        borderRadius: 6,
      },

      '.large': {
        borderWidth: 0,
        borderRadius: variables.borderRadiusBase,
        height: 168,
        width: 168,

        '.default': {
          borderWidth: 1,
        },
      },
    },

    'NativeBase.Button': {
      elevation: 0,
      height: 50,

      'iola.Spinner': {
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
          backgroundColor: 'transparent',
        },

        '.disabled': {
          backgroundColor: 'transparent',
          opacity: 0.3,
        }
      },

      '.bordered': {
        '.secondary': {
          backgroundColor: 'transparent',
        },
      },

      '.light': {
        'NativeBase.Text': {
          color: variables.textColor,
        },
      },

      '.secondary': {
        borderColor: '#E8EAF0',
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
        },
      },
    },

    'NativeBase.H1': {
      fontWeight: '500',
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.H2': {
      fontWeight: '600',
      fontSize: 24,

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

      '.secondary': {
        color: variables.secondaryTextColor,
      },
    },

    'NativeBase.Icon': {
      '.inverse': {
        color: variables.inverseTextColor,
      },

      '.secondary': {
        color: variables.secondaryTextColor,
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
            color: variables.secondaryTextColor,
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
          width: null,
          minWidth: 18,
          paddingHorizontal: 2,
          paddingVertical: 0,
          borderRadius: 9,

          'NativeBase.Text': {
            fontWeight: 'bold',
            fontSize: 10,
            lineHeight: 18,
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

      '.last': {
        /**
         * Hide bottom border of last item in list
         * Overriding `borderBottomWidth` did not work, so had to hack it
         */
        'NativeBase.Body': {
          borderBottomColor: 'rgba(0, 0, 0, 0)',
        },
        'NativeBase.Right': {
          borderBottomColor: 'rgba(0, 0, 0, 0)',
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
            color: variables.secondaryTextColor,
          },

          'NativeBase.Icon': {
            width: 30,
            fontSize: 20,
            color: variables.secondaryTextColor,
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

    'iola.Divider': {},

    'iola.Shadow': {},

    'iola.ScreenHeader': {
      opaque: {
        backgroundColor: variables.foregroundColor,
      },

      transparent: {
        backgroundColor: 'transparent',
      },

      icon: {
        color: variables.toolbarBtnTextColor,
      },

      'NativeBase.Icon': {
        fontSize: 35,
        color: variables.toolbarBtnTextColor,
        margin: 7,
      },

      'iola.TouchableOpacity': {
        paddingHorizontal: variables.contentPadding,

        'NativeBase.Text': {
          color: variables.brandPrimary,
        },

        '.secondary': {
          'NativeBase.Text': {
            color: variables.toolbarBtnTextColor,
          },
        },
      },
    },


    'iola.SearchBar': {
      inputWrap: {
        backgroundColor: variables.toolbarInputColor,
      },
    },

    'iola.TabBar': {
      'iola.TouchableOpacity': {
        'NativeBase.ViewNB': {
          '.label': {
            'NativeBase.Text': {
              color: variables.brandPrimary,
            },
          },
        },

        '.active': {
          'NativeBase.ViewNB': {
            '.indicator': {
              backgroundColor: variables.brandPrimary,
            },
          },
        },
      },
    },

    'iola.BottomTabBar': {
      activeTintColor: variables.brandPrimary,
      inactiveTintColor: variables.toolbarBtnTextColor,
    },

    'iola.TabBarLabel': {
      'NativeBase.Text': {
        color: variables.brandPrimary,
      },
    },

    'iola.ChatFooter': {
      root: {
        backgroundColor: variables.foregroundColor,
      },

      inputWrap: {
        backgroundColor: variables.toolbarInputColor,
      },

      sendIcon: {
        color: variables.toolbarBtnTextColor,
      },
    },

    'iola.NoContent': {
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
    'iola.ChatListItem': {
      'iola.Placeholder': {
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

    'iola.FieldSection': {
      'iola.Placeholder': {
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

    'iola.PhotoListItem': {
      'iola.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'iola.UserAvatar': {
      'iola.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'iola.UserHeading': {
      'placeholder': {
        backgroundColor: variables.highlightColor,
      },

      'NativeBase.ViewNB': {
        'iola.UserAvatar': {
          'iola.Thumbnail': {
            'iola.Image': {
              backgroundColor: variables.highlightColor,
            },
          },
          'iola.Placeholder': {
            backgroundColor: variables.highlightColor,
          },
        },
      },
    },

    'iola.UserListItem': {
      'iola.Placeholder': {
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

    'iola.UserList': {
      '.searchResult': {
        'iola.UserListItem': {
          'iola.Placeholder': {
            'NativeBase.ListItem': {
              'NativeBase.Left': {
                'NativeBase.ViewNB': {
                  backgroundColor: variables.highlightColor,
                },
              },

              'NativeBase.Body': {
                'NativeBase.ViewNB': {
                  backgroundColor: variables.highlightColor,
                },
              },
            },
          },
        },
      },
    },

    'iola.UsersRowItem': {
      'iola.Placeholder': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.highlightColor,
        },
      },
    },

    'iola.RefreshControl': {
      color: variables.brandPrimary,
    },

    'iola.BarBackgroundView': {
      backgroundColor: variables.foregroundColor,
    },

    'iola.AvatarInput': {
      placeholder: {
        backgroundColor: variables.placeholderColor,
      },
    },

    'iola.ImageComments': {
      container: {
        backgroundColor: variables.backgroundColor,
      },
    },

    'iola.ImageCommentsItem': {
      placeholderContent: {
        backgroundColor: variables.placeholderColor,
      },

      placeholderAvatar: {
        backgroundColor: variables.placeholderColor,
      },
    },

    'iola.MessageItem': {
      'iola.Placeholder': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.placeholderColor,
        },
      },
    },

    'iola.FieldItem': {
      borderBottomColor: variables.listBorderColor,
    },

    'iola.BackdropHeader': {
      'iola.TouchableOpacity': {
        'NativeBase.Text': {
          color: variables.brandPrimary,
        },

        '.cancel': {
          'NativeBase.Text': {
            color: variables.toolbarBtnTextColor,
          },
        },
      },
    },

    'iola.BackButton': {
      '.icon': {
        color: variables.toolbarBtnTextColor,
      },
    },

    'iola.ImageView': {
      indicator: {
        color: variables.toolbarBtnTextColor,
      },

      backIcon: {
        color: variables.toolbarBtnTextColor,
      },

      meatballIcon: {
        color: variables.toolbarBtnTextColor,
      },
    },

    'Sparkls.ErrorBoundary': {
      'NativeBase.ViewNB': {
        'NativeBase.H1': {
          color: variables.brandPrimary,
        },
      },
    },

    'iola.Image': {
      backgroundColor: variables.placeholderColor,
    },

    'iola.ListPicker': {
      selectedColor: {
        color: variables.brandPrimary,
      },
    },

    'iola.ActionSheet': {
      buttonText: {
        color: variables.brandPrimary,
      },
    },
  }),
}));
