import React from 'react';
import { connect } from 'react-redux';

const Options = ({ dispatch, options }) => {
  console.log('options:', options);
  return (
    <div>
      <span>options here</span>
      <span style={{margin: '10px'}}>{options.count}</span>
      <button onClick={() => dispatch({ type: 'options/increment', payload: 1})}>add</button>
    </div>
  );
}

export default connect(({ options }) => ({
  options,
}))(Options);