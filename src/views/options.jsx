import React, { useState } from 'react';
import { connect } from 'react-redux';

const Options = ({ dispatch, options }) => {
  const [addAmount, setAddAmount] = useState(1);
  return (
    <div>
      <div style={{ margin: '10px 0' }}>
        count is:{options.count}
      </div>
      <div>
        <button onClick={() => dispatch({ type: 'options/addAsync', payload: addAmount })}>add</button>
        <input type="text" value={addAmount} onChange={(e) => setAddAmount(+e.target.value)} /> after 1 second
      </div>
    </div>
  );
}

export default connect(({ options }) => ({
  options,
}))(Options);