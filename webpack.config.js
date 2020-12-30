const { resolve } = require("path");
const MaxForLivePlugin = require("./src/webpack/MaxForLivePlugin");

module.exports = {
  entry: "./src/filterMidiCC.ts",
  output: {
    library: "filterMidiCC",
    filename: "filterMidiCC.js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  optimization: {
    minimize: false,
  },
  mode: "production",
  plugins: [new MaxForLivePlugin({ objectName: "filterMidiCC" })],
  target: "es5",
};
