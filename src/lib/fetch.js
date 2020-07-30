const fetchBase = require('isomorphic-fetch');
const defaultOptions = {
  method: 'GET',
  data: {},
}

export default function fetch(url, opt = {}) {
  let options = Object.assign({}, defaultOptions, opt );
  switch (options.method) {
    case 'HEAD':
    case 'GET': {
      let params = Object.keys(options.data).map(key => `${key}=${options.data[key]}`).join('&');
      let seperator = url.includes('?') ? '&' : '?';
      url += seperator + params;
      delete options.data;
      break;
    }
    default: {
      options.headers = Object.assign(opt.headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
      options.body = JSON.stringify(options.data);
      break;
    }
  }
  return fetchBase(url, options)
    .then((response) => {
      if (opt.raw) {
        return response.text();
      }
      return response.json();
    })
    .catch((err) => {
      throw err;
    });
}
