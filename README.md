# Messenger App

## Install
- `yarn`
- `react-native link`

## Development
1) Run react-native server + GraphQL scheme watch
  - `yarn start`
2) Run your emulator:
  - Android:
    - `yarn run:android`
    - `yarn log:android`
  - iOS:
    - `yarn run:ios`
    - `yarn log:ios`
3) `yarn postinstall` // @TODO: remove when Apollo fix this: https://github.com/apollographql/apollo-client/issues/3236

## Coding Conventions
- [Airbnb Code Style](https://github.com/airbnb/javascript)
- destructuring: in one line if length < 100 but in multiple lines if has default values
