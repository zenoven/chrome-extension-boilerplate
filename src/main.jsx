import React from 'react';
import ReactDOM from 'react-dom';
import APP from 'views/app';
export const render = () => {
  ReactDOM.render(<APP />, document.getElementById('app'))
}

export default { render };
