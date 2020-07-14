import Promise from 'bluebird';

export const c = Object.assign({}, chrome);

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
  c[apiName] = Promise.promisifyAll(c[apiName], { promisifier});
});

export const getAllTabs = () => {
  return c.windows.getCurrentAsync().then((win) => {
    return c.tabs.queryAsync({ windowId: win.id });
  });
};
