import {fetchWithPrefix} from '../lib/util';
const fetch = fetchWithPrefix('https://api.readhub.cn');

export function getTopics(data) {
  return fetch('/topic?lastCursor=&pageSize=20', {
    method: 'GET',
    data
  });
}