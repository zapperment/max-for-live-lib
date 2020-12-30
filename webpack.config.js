require("dotenv").config();
const { resolve } = require("path");
const MaxForLivePlugin = require("./src/webpack/MaxForLivePlugin");

const { OUTPUT_PATH } = process.env;
const path = OUTPUT_PATH.startsWith("/")
  ? OUTPUT_PATH
  : resolve(__dirname, OUTPUT_PATH);

module.exports = {
  entry: "./src/filterMidiCC.ts",
  output: {
    library: "filterMidiCC",
    filename: "filterMidiCC.js",
    path,
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
