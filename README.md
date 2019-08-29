# iola messenger


## Install
  - `yarn`
  - Copy the .env file `cp .env.sample .env` and modify it


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
3) `yarn postinstall` // TODO: remove when Apollo fix this: https://github.com/apollographql/apollo-client/issues/3236

### Tests
Investigate this: https://reactnativetesting.io/
TODO: Fill this section

### Troubleshooting
1. How to debug the subscriptions:
   - Start the subscription in the app
   - Run in the Postman (via GET): `*DEV_PLATFORM_URL*/*INTEGRATION_PATH*/subscriptions/*streamId value from the subscriptions table (ow_esapi_subscription)*` (for example: http://192.168.0.100/oxwall/iola/api/subscriptions/5f1e34db2cf318ae)
   - Run mutation that triggers the subscription (for example from GraphiQL interface)
2. How to debug Java errors:
  - `adb logcat *:E`
3. "Metro Bundler can't listen on port 8081" error (or "Error: listen EADDRINUSE :::7007")
   - `sudo lsof -i :8081`
   - `kill -9 *PID from the previous command results*`

### Code style
  - [Airbnb Code Style](https://github.com/airbnb/javascript)
  - Destructuring: in one line if length < 100 but in multiple lines if has default values


## Demo/Production
0) Setup the environment:
  - Common:
    - nvm with Node.js v10.15.3: `nvm install 10.15.3` (used in prod build: `/usr/local/opt/nvm/versions/node/v10.15.3/bin/node`) // @DEPRECATED
    - [Install Fastlane](https://docs.fastlane.tools/getting-started/ios/setup/)
    - `bundle install`
    - Fill the `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` in the .env file:
      - Go to https://appleid.apple.com/account/manage
      - Click "Generate Password…" link under the "APP-SPECIFIC PASSWORDS" section
  - Android:
    - passwords.properties: `cp android/passwords.properties.sample android/passwords.properties` and fill it
    - debug.keystore: `cd android/app; keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`
  - iOS:
    - Install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html#installation)
    - `pod install`
1) Test the release app version:
  - Android
    1) Uninstall the previous version of the app you already have installed
    2) Build the .apk file + install it on emulator/device: `yarn release:test:android`
  - iOS: `yarn fastlane:ios:beta`
2) Build the release app version (build the apk file):
  - Android: `yarn release:build:android`
  - Get the new .aab (Android App Bundle) file here: `./android/app/build/outputs/bundle/applicationRelease`  
  - iOS: TODO

## For future customizations
  - Change the app icon:
  - [Online Android Asset Studio](http://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=clipart&foreground.clipart=android&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher)


## Global TODOs
  - After going live add the `lint:fix` action to pre-commit hook (via Husky)
