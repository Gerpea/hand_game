const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: {
    hand_recognizer: "./src/index.ts",
    "hand_recognizer.min": "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "_bundles"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "hand_recognizer",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      fs: false
    }
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /\.worker\.ts$/]
      }
    ]
  },
  mode: "production",
  plugins: [new NodePolyfillPlugin()]
};
