require("dotenv").config();
const { resolve } = require("path");
const { readdirSync, lstatSync } = require("fs");
const MaxForLivePlugin = require("./src/webpack/MaxForLivePlugin");

const { OUTPUT_PATH } = process.env;
const path = OUTPUT_PATH.startsWith("/")
  ? OUTPUT_PATH
  : resolve(__dirname, OUTPUT_PATH);

const objectsDir = resolve(__dirname, "./src/objects");
const entry = readdirSync(objectsDir)
  .filter((curr) => lstatSync(resolve(objectsDir, curr)).isDirectory())
  .reduce((acc, curr) => ({ ...acc, [curr]: resolve(objectsDir, curr) }), {});

module.exports = {
  entry,
  output: {
    library: "[name]",
    filename: "[name].js",
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
  plugins: [new MaxForLivePlugin()],
  target: "es5",
};
