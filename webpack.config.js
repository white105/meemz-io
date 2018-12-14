var path = require('path');
var webpack = require('webpack');

//bundles all styles from app/styles/app.css as well as all javascript into app/bundle.js
module.exports = {
    entry: {
      bundle: './app/index.js'
    },
    output: {
        path: path.join(__dirname, 'app'),
        filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.jsx?$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/,
        query: { cacheDirectory: true, presets: ['react', 'es2015'] } },
        { test: /\.txt$/, use: 'raw-loader' },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.(png|jpg)$/, loader: 'url?limit=25000' }
      ]
    },
    devServer: {
      historyApiFallback: true
    },
    node: {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };
