import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {dayjs} from 'lib/util';

const TopicList = styled.ul`
  width: 400px;
  margin: 0;
  padding: 0;
  font-size: 14px;
`;
const Topic = styled.li`
  list-style: none;
  padding: 16px;
  color: #777;
  transition: all .15s ease-in-out;
  & + & {
    border-top: 1px solid #eee;
  }
  &:hover {
    color: #555;
    background: #fafafa;
  }
  ${props => props.read ? 'opacity: .5' : ''}
`;
Topic.Title = styled.h3`
  margin: 0;
  line-height: 1.5;
  list-style: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  ${Topic}:hover & {
    color: #333;
  }
`;
Topic.TitleContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
`;
Topic.PublishTime = styled.div`
  font-size: 12px;
  color: #888;
  font-weight: normal;
`;
Topic.Summary = styled.div`
  display: ${props => !props.folded ? '-webkit-box' : 'none'};
  -webkit-box-orient: vertical;
  margin-top: 10px;
  font-size: 12px;
  line-height: 18px;
  height: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
`;

const timeAgo = (anchor) => {
  let now = dayjs();
  return now.to(dayjs(anchor));
}

const Options = ({ dispatch, readhub }) => {
  useEffect(() => {
    dispatch({ type: 'readhub/fetchTopics' });
  }, [])
  const {
    topics,
    status: {
      read
    }
  } = readhub;
  return (
    <div>
      <TopicList>
        {
          topics.map(topic => {
            return (
              <Topic
                key={topic.id}
                onClick={() => dispatch({ type: 'readhub/markRead', payload: topic.id })}
                read={read.includes(topic.id)}
              >
                <Topic.Title title={topic.title}>
                  <Topic.TitleContent>{topic.title}</Topic.TitleContent>
                  <Topic.PublishTime>{timeAgo(topic.createdAt)}</Topic.PublishTime>
                </Topic.Title>
                <Topic.Summary>{topic.summary}</Topic.Summary>
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