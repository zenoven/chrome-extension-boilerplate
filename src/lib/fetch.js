const fetchBase = require('isomorphic-fetch');

export default function fetch(url, opt = {}) {
  return fetchBase(url, opt)
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
