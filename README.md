# Messenger App

## Install
- `yarn`
- `react-native link`

## Development
1) Run dev server: `yarn start`
2) Select what you want to run:
  - App
    - Android
      - Logs: `yarn log:android`
      - Build app: `yarn run:android`
    - iOS
      - Logs: `yarn log:ios`
      - Build app: `yarn run:ios`
  - Storybook
    - Run storybook server: `yarn storybook`
      - Android
        - Build Storybook app: `yarn run:android-storybook`
        - Web UI: http://localhost:7007/
3) `yarn postinstall` // @TODO: remove when Apollo fix this: https://github.com/apollographql/apollo-client/issues/3236
