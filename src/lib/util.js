import Promise from 'bluebird';
import fetch from './fetch';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
export const c = Object.assign({}, chrome || {});
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const promisifiedChromeAPIs = ['windows', 'tabs', 'browserAction'];
const promisifier = (method) => {
  return function (...args) {
    let self = this;
    return new Promise((resolve, reject) => {
      if (c.runtime.lastError) {
        return reject(c.runtime.lastError)
      }
      args.push(resolve);
      method.call(self, ...args);
    })
  }
};
promisifiedChromeAPIs.forEach((apiName) => {
  c[apiName] && (c[apiName] = Promise.promisifyAll(c[apiName], { promisifier}));
});

export const getAllTabs = () => {
  return c.windows.getCurrentAsync().then((win) => {
    return c.tabs.queryAsync({ windowId: win.id });
  });
};

export const fetchWithPrefix = (prefix) => (...args) => {
  let url = args[0];
  url = prefix + url;
  return fetch(url, ...(args.slice(1)));
};

export const noop = () => { };

export {dayjs};
