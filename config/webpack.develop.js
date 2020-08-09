const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')],
    port: 3000,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
});
