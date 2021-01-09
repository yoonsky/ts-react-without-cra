// 경로
const path = require('path');
const appIndex = path.resolve(__dirname, 'src', 'index.tsx');
const appBuild = path.resolve(__dirname, 'build');
const appHtml = path.resolve(__dirname, 'public', 'index.html');
const appPublic = path.resolve(__dirname, 'public');
// 플러그인
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
//devTools failed to load SourceMap 에러처리
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = (webpackEnv) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  return {
    devServer: {
      port: 3000,
      contentBase: appPublic,
      open: true,
      historyApiFallback: true,
      overlay: true,
      stats: 'error-warnings',
    },
    devtool: isProd
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isDev && 'cheap-module-source-map',
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isProd
        ? 'static/js/[name].[contenthash:8].js'
        : isDev && 'static/js/[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isDev ? true : false,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: appHtml,
      }),
    ],
  };
};
