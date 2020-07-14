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

const watcher = env === 'development' && chokidar.watch(path.join(srcPath, 'language.json'));

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
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        signale.info(stats.toString({
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
        }))
        return reject(err);
      }
      resolve(stats);
    })
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
