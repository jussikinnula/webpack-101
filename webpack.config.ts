import * as webpack from 'webpack';
import * as path from 'path';

// Common plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const DefinePlugin = webpack.DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;

// Bundle splitting
// const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

// Bundle size optimization 
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
// const UglifyJsPlugin3 = require('uglifyjs-webpack-plugin3');

const BUILD_DIR = './target';

export default {
  cache: false, // true in development
  devtool: 'source-map', // 'cheap-module-eval-source-map' in development

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules']
  },

  context: path.resolve(__dirname, './'),

  entry: {
    client: './src/client'
  },

  output: {
    filename: 'assets/[name].js?[hash]',
    path: path.resolve(__dirname, BUILD_DIR),
    publicPath: '/'
  },

  plugins: [
    new CleanWebpackPlugin([BUILD_DIR]),

    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production') // or 'development'
    }),

    new webpack.ContextReplacementPlugin(
      /\@angular(\\|\/)core(\\|\/)esm5/,
      path.join(__dirname, './src')
    ),

    new LoaderOptionsPlugin({
      debug: false // true in development
    }),

    new HtmlWebpackPlugin(),

    new OccurrenceOrderPlugin(true),

    new NoEmitOnErrorsPlugin(),

    // new CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: module => /node_modules/.test(module.context)
    // }),

    // new CommonsChunkPlugin({
    //   name: 'runtime'
    // }),

    // new UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     conditionals: true,
    //     unused: true,
    //     comparisons: true,
    //     sequences: true,
    //     dead_code: true,
    //     evaluate: true,
    //     if_return: true,
    //     join_vars: true,
    //     negate_iife: false
    //   },
    //   sourceMap: true
    // })

    // new UglifyJsPlugin3()

    // new BabelMinifyWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/\.(spec|e2e|d)\.ts$/],
        loader: 'ts-loader',
        // options: {
        //   configFile: 'tsconfig.es2015.json'
        // }
      }
    ]
  }
};
