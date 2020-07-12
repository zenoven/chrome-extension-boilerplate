const path = require('path');
const gulp = require('gulp');
const execa = require('execa');
const del = require('del');
const util = require('gulp-util');
const zip = require('gulp-zip');
const package = require('./package.json');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const { series, src, dest, watch} = gulp;
const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');

function translate() {
  return del(distPath + '/_locales')
    .then(() => {
      return execa.command('chrome-i18n -f ' + path.join(srcPath, '/language.json'));
    })
}

function compress() {
  return src(`${distPath}/*`)
    .pipe(zip(package.name + '-' + package.version + '.zip'))
    .pipe(dest(distPath));
};

function bundle() {
  return Promise.resolve('done')
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, function (err, stats) {
      if (err) {
        reject(new util.PluginError('webpack build', err));
        return;
      }
      resolve();
    })
  })
  return webpack(webpackConfig, function (err, stats) {
    if (err) {
      return (new util.PluginError('webpack build', err));
    }
    cb();
  })
};

function build(cb) {
  return series(bundle, translate, compress);
}

function dev(cb) {
  translate().then(() => {
    cb && cb();
    watch(srcPath + '/language.json', () => {
      translate();

    });
  })
}

exports.build = build;
exports.dev = dev;
exports.compress = compress;
exports.default = dev;
