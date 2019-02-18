# iola messenger


## Install
  - `yarn`
  - `cp .env.sample .env` and modify the `.env` file


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
  - React Developer Tools
    - install: `npm install -g react-devtools`
    - run: `react-devtools`
3) `yarn postinstall` // @TODO: remove when Apollo fix this: https://github.com/apollographql/apollo-client/issues/3236

### Tests
Investigate this: https://reactnativetesting.io/
@TODO: Fill this section

### Troubleshooting
1. How to debug the subscriptions
   - Start the subscription on the app
   - Run in Postman (via GET): `*GRAPHQL_SUBSCRIPTIONS_URL from your .env file*/*streamId value from the subscriptions table (ow_esapi_subscription)*` (for example: http://192.168.31.74/ox/oxwall-1.8.4.1/everywhere/api/subscriptions/5f1e34db2cf318ae)
   - Run mutation that triggers the subscription (for example from GraphiQL interface)
2. "Metro Bundler can't listen on port 8081" error (or "Error: listen EADDRINUSE :::7007")
   - `sudo lsof -i :8081`
   - `kill -9 PID_FROM_RESULTS_OF_THE_PREVIOUS_COMMAND`

### Code style
  - [Airbnb Code Style](https://github.com/airbnb/javascript)
  - Destructuring: in one line if length < 100 but in multiple lines if has default values


## Production
0) Setup the production environment:
  - Android:
    1) `cp android/.gradle/gradle.properties.sample android/.gradle/gradle.properties` and fill it
  - iOS:
    1) @TODO
1) Build the app:
  - Android:
    1) Run the React Native Packager: `yarn server:prod`
    1) Copy the bunlde to assets: `curl "localhost:8081/index.android.bundle?platform=android&dev=false&minify=true" -o "android/app/src/main/assets/index.android.bundle"`
    2) Build the prod APK version: `yarn prod:android`
  - iOS:
      1) @TODO
2) Change the app icon:
  - [Online Android Asset Studio](http://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=clipart&foreground.clipart=android&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher)


## Global TODOs
  - After going live add the `lint:fix` action to pre-commit hook (via Husky)
