import Promise from 'bluebird';
import fetch from './fetch';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
export const c = Object.assign({}, chrome || {});
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
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

export const clearStorage = (callback, type = 'sync') => {
  return c.storage[type].clear(callback)
}

export const noop = () => { };

export { dayjs };

export const useMobileUA = (win) => {
  if (win.navigator.userAgent !== mobileUA) {
    Object.defineProperty(win.navigator, 'userAgent', {
      value: mobileUA,
      writable: false
    });
  }
}
