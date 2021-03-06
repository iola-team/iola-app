module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    "@babel/preset-flow",
    "module:react-native-dotenv",
  ],

  plugins: [
    "@babel/plugin-proposal-function-bind",
    "import-graphql",

    ["@babel/plugin-proposal-decorators", {
      legacy: true,
    }],

    ["module-resolver", {
      alias: {
        "~application": "./src/application",
        "~components": "./src/components",
        "~graph": "./src/graph",
        "~screens": "./src/screens",
        "~storybook": "./src/storybook",
        "~theme": "./src/theme",
        "~utils": "./src/utils",
      },
      extensions: [
        ".ios.js",
        ".android.js",
        ".js",
        ".json",
      ],
    }],
  ],
};
