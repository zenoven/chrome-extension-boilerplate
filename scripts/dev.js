/**
 * Created by zenoven@2018/5/17 15:39
 */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const signale = require('signale');
const Promise = require('bluebird');
const chokidar = require('chokidar');
const WebpackDevServer = require('webpack-dev-server');

const packageJSON = require('../package.json');
const root = path.join(__dirname, '../');
const srcPath = path.join(root, 'src');
const distPath = path.join(root, 'dist');
const config = require('../webpack.config');
const bestzip = require('bestzip');
const {
  name,
  version,
} = packageJSON;
const env = process.env.NODE_ENV || 'development';
const devPort = packageJSON.devConfig.port;
const watcher = env === 'development' && chokidar.watch(path.join(srcPath, 'language.json'));
const statsConfig = {
  colors: true,
  timings: true,
  hash: true,
  version: true,
  errorDetails: true,
  assets: false,
  chunks: false,
  children: false,
  modules: false,
  chunkModules: false
};

const devServerConfig = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  hot: false,
  // hotOnly: true,
  disableHostCheck: true,
  contentBase: distPath,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  port: devPort,
  writeToDisk: true,
};

function logTime(promiseBuilder, label) {
  label = label || promiseBuilder.name;
  return () => {
    let promise = promiseBuilder();
    signale.start(label);
    let start = Date.now();
    return promise.then(() => {
      let duration = ((Date.now() - start) / 1000).toFixed(2) + 's';
      signale.success(`${label} done in ${duration}.`);
    });
  }
}

function clean() {
  return fs.remove(distPath);
}

function cleanLocales() {
  return fs.remove(path.join(distPath, '_locales'));
}

function translate() {
  return execa.command('chrome-i18n -f ' + path.join(srcPath, '/language.json'));
}

function bundle() {
  return new Promise((resolve, reject) => {
    let compiler = webpack(config);
    if (env === 'development') {
      let devServer = new WebpackDevServer(compiler, {
        ...devServerConfig,
        stats: statsConfig,
        after(app, server, compiler) {
          resolve();
          app.on('error', reject);
        }
      });
      devServer.listen(devPort);
    } else {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          signale.info(stats.toString(statsConfig));
          return reject(err);
        }
        resolve(stats);
      });
    }
  })
}

function zip() {
  const now = Date.now();
  const fileName = `${name}-${version}-${now}.zip`;
  return bestzip({
    source: './*',
    destination: path.join(distPath, fileName),
    cwd: distPath,
  });
}

function build() {
  return Promise
    .resolve()
    .then(logTime(clean))
    .then(logTime(bundle))
    .then(logTime(translate))
    .then(env === 'development' ? () => Promise.resolve() : logTime(zip))
}

function watch() {
  signale.success('dev server started and watching file changes...');
  watcher.on('change', () => {
    Promise
      .resolve()
      .then(logTime(cleanLocales))
      .then(logTime(translate))
      .catch(e => {
        signale.fatal(e)
        process.exit(1)
      });
  });
}

signale.start(`start compiling with env:${env}`);

Promise
  .resolve()
  .then(logTime(build))
  .then(() => {
    watcher && watch();
  })
  .catch(e => {
    signale.fatal(e)
    process.exit(1)
  });
