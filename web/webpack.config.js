const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const vendor = [
  'history',
  'bitcore-lib',
  'moment',
  'uuid',
  'classnames',
  'protobufjs',
  'react',
  'react-autocomplete',
  'react-datepicker',
  'react-dom',
  'react-router',
  'react-overlays',
  'react-qr',
  'react-redux',
  'react-tabs',
  'redux',
  'redux-saga',
  'socket.io-client',
];

const production = !!process.env['PRODUCTION'];

const extractor = new ExtractTextPlugin("styles.css")


module.exports = {
  entry: {
    'app': production
    ? [
      './src/bootstrap.ts',
      './src/index.tsx'
    ]
    : [
      'webpack-hot-middleware/client',
      './src/bootstrap.ts',
      './src/index.tsx'
    ],
    'vendor': vendor
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: "/"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: production ? 'cheap-module-source-map' : 'eval',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json']
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loaders: production
        ? ['babel', 'awesome-typescript-loader']
        : ['react-hot', 'babel', 'awesome-typescript-loader'] },
      {
        test: /\.s?css$/, loader: production
        ? extractor.extract(
          'style-loader',
          ['css-loader?-autoprefixer', 'postcss-loader', 'sass-loader']
        )
        : 'style!css?sourceMap&importLoaders=1!postcss!sass?sourceMap'
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.svg$/, loader: 'file-loader' }
    ],

    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  postcss: () => {
    return [
      require('autoprefixer')
    ];
  },

  plugins: production
  ? [
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.js" }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'meta', chunks: ['vendor'], filename: "meta.js" }),
    new HtmlWebpackPlugin({ title: 'Poet App', template: 'src/index.html' }),
    extractor,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ]
  : [
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.js" }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'meta', chunks: ['vendor'], filename: "meta.js" }),
    new HtmlWebpackPlugin({ title: 'Poet App', template: 'src/index.html' }),
    extractor,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
};
