const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const os = require('os');
const glob = require('glob');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const root = path.join(__dirname, './');
const srcPath = path.join(root, 'src');
const distPath = path.join(root, 'dist');
const env = process.env.NODE_ENV || 'development';
const entry = {};

glob.sync('*.html', { cwd: srcPath })
  .forEach((filePath) => {
    let chunk = filePath.slice(0, path.extname(filePath).length * -1)
    entry[chunk] = [`./${chunk}`];
  })

const getExtraPlugins = () => {
  return Object.keys(entry).map((chunk, index) => {
    return new HTMLWebpackPlugin({
      filename: chunk + '.html',
      template: chunk + '.html',
      minify: true,
      inject: 'body',
      chunks: [chunk]
    });
  });
  return HTMLWebpackInstances;
}
module.exports = {
  mode: env,
  entry,
  context: srcPath,
  output: {
    path: distPath,
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader',
        options: {
          id: 'js'
        }
      },
      // 项目内源码样式，使用css modules
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        loader: {
          loader: 'happypack/loader',
          options: {
            id: 'style-src'
          }
        }
      },
      // 针对外部依赖样式，不使用css modules
      {
        test: /\.(less|css)$/,
        include: /node_modules/,
        loader: {
          loader: 'happypack/loader',
          options: {
            id: 'style-dependencies'
          }
        }
      },
      {
        test: /\.(gif|png|jpg|jpeg|eot|ttf|svg|woff|ico|icon)/,
        loader: 'url-loader'
      }
    ]
  },

  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.less'],
  },
  plugins: [
    env === 'production' && new CleanWebpackPlugin(),
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true,
      verboseWhenProfiling: true
    }),
    new HappyPack({
      id: 'style-src',
      loaders: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            import: true,
            localIdentName: '[name]__[local]--[hash:base64:5]',
            importLoaders: 1,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              ctx: {
                cssnext: {},
                cssnano: {},
                autoprefixer: {}
              }
            }
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true,
            javascriptEnabled: true
          },
        }
      ],
      threadPool: happyThreadPool,
      verbose: true,
      verboseWhenProfiling: true
    }),
    new HappyPack({
      id: 'style-dependencies',
      loaders: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              ctx: {
                cssnext: {},
                cssnano: {},
                autoprefixer: {}
              }
            }
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        }
      ],
      threadPool: happyThreadPool,
      verbose: true,
      verboseWhenProfiling: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
        },
        {
          from: 'assets/images/icons/*',
        }
      ]
    }),
  ].concat(getExtraPlugins()).filter(x => x),
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
  },

};
