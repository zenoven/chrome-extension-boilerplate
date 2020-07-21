import React, { useState } from 'react';
import { connect } from 'react-redux';

const Options = ({ dispatch, readhub }) => {
  console.log('readhub:', readhub);
  const { topics } = readhub;
  return (
    <div>
      <ul>
        {
          topics.map(topic => {
            return (
              <li key={topic.id}>
                {topic.summary}
              </li>
            )
          })
        }
      </ul>
      <div>
        <button onClick={() => dispatch({ type: 'readhub/fetchTopics' })}>Fetch topics</button>
      </div>
    </div>
  );
}

export default connect(({ readhub }) => ({
  readhub,
}))(Options);