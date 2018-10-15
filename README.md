# Messenger App

## Install
- `yarn`
- `rnpm link`

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

## Code style
- [Airbnb Code Style](https://github.com/airbnb/javascript)
- Destructuring: in one line if length < 100 but in multiple lines if has default values

## GLOBAL TODO
- After go live add the lint:fix action to pre-commit hook (via Husky)
