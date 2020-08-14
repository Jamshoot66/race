const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/',
  },
  
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/sound', to: 'sound' },
        { from: 'public/textures', to: 'textures' },
      ],
    }),
  ],
});
