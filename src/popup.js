import React from 'react';
import ReactDOM from 'react-dom';

const render = (Component) => {
  ReactDOM.hydrate(<Component />, document.getElementById('app'))
}

render(() => {
  return <div>hello</div>
})