const { resolve } = require('path');
const webpack = require('webpack');
const MaxForLivePlugin = require('./src/webpack/MaxForLivePlugin');

module.exports = {
    entry: './src/filterMidiCC.js',
    output: {
        library: 'filterMidiCC',
        filename: 'filterMidiCC.js',
        //path: '/Users/pahund/Library/Mobile\ Documents/com~apple~CloudDocs/Private\ Drive/Audioproduktion/Ableton Live/User Library/Max for Live'
        path: resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: false
    },
    mode: "production",
    plugins: [
        new MaxForLivePlugin({ objectName: 'filterMidiCC' })
    ],
    target: "es5"
};
