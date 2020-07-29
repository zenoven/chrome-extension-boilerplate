import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
const TopicList = styled.ul`
  width: 400px;
  margin: 16px;
  padding: 0;
  font-size: 14px;
`;
const Topic = styled.li`
  list-style: none;
  padding: 16px;
  color: #666;
  & + & {
    border-top: 1px solid #eee;
  }
`;
Topic.Title = styled.h3`
  margin: 0;
  line-height: 1.5;
  list-style: none;
  color: #444;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  font-size: 14px;
`;
Topic.Summary = styled.div`
  margin-top: 20px;
  display: ${props => !props.folded ? 'block' : 'none'};
  font-size: 12px;
`;
Topic.Summary.defaultProps = {
  folded: true,
};

const toggleSummaryFolded = ({ summaryFoldedMap, topic }) => {
  let oldFolded = typeof summaryFoldedMap[topic.id] === 'undefined' || summaryFoldedMap[topic.id];
  return { ...summaryFoldedMap, [topic.id]: !oldFolded};
}


const Options = ({ dispatch, readhub }) => {
  useEffect(() => {
    dispatch({ type: 'readhub/fetchTopics' });
  }, [])
  const [summaryFoldedMap, updateSummaryFoldedMap] = useState({});
  const { topics } = readhub;
  return (
    <div>
      <TopicList>
        {
          topics.map(topic => {
            return (
              <Topic key={topic.id}>
                <Topic.Title
                  title={topic.title}
                  onClick={() => updateSummaryFoldedMap(toggleSummaryFolded({ summaryFoldedMap, topic }))}
                >{topic.title}</Topic.Title>
                <Topic.Summary folded={summaryFoldedMap[topic.id]}>{topic.summary}</Topic.Summary>
              </Topic>
            )
          })
        }
      </TopicList>
    </div>
  );
}

export default connect(({ readhub }) => ({
  readhub,
}))(Options);