import fetch from '../lib/fetch';
const prefix = 'https://api.readhub.cn';
const fetchWithPrefix = (...args) => {
  let url = args[0];
  url = prefix + url;
  // console.log('url:', url, 'args')
  return fetch(url, ...(args.slice(1)));
}

export function getTopics(data) {
  return fetchWithPrefix('/topic?lastCursor=&pageSize=20', {
    method: 'GET',
    data
  });
}