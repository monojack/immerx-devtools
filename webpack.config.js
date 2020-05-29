const path = require('path')
const webpack = require('webpack')

const Stylish = require('webpack-stylish')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    panel: './extension/panel.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'extension'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
        // use: ['file-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.module\.s?[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.s?[ac]ss$/i,
        exclude: /\.module\.s?[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'panel.html',
      template: path.join(__dirname, 'extension/panel.html'),
    }),
    new CopyPlugin([
      {
        from: path.join(__dirname, 'extension/icons/'),
        to: 'icons',
      },
      path.join(__dirname, 'extension/background.js'),
      path.join(__dirname, 'extension/contentScript.js'),
      path.join(__dirname, 'extension/devtools.html'),
      path.join(__dirname, 'extension/devtools.js'),
      path.join(__dirname, 'extension/hook.js'),
      path.join(__dirname, 'extension/manifest.json'),
    ]),
    new Stylish(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin({})],
  },
}
