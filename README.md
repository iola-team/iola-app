# Messenger App

## Install
- `yarn`
- `react-native link`

## Development
1) Run react-native server + GraphQL scheme watch
  - `yarn start`
2) Run application:
  - Android:
    - `yarn log:android`
    - `yarn run:android`
  - iOS:
    - `yarn log:ios`
    - `yarn run:ios`
3) Run Storybook
  - `yarn storybook`
  - `yarn run:android-storybook`
4) `yarn postinstall` // @TODO: remove when Apollo fix this: https://github.com/apollographql/apollo-client/issues/3236
