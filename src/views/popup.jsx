import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { dayjs, noop } from 'lib/util';
import Modal from '../component/modal';

const Page = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 14px;
`;
const List = styled.ul`
  margin: 0;
  padding: 0;
`;
const Item = styled.div`
  list-style: none;
  padding: 16px;
  color: #777;
  transition: all .15s ease-in-out;
  & + & {
    border-top: 1px solid #eee;
  }
  ${props => !props.showDetail && (`
    &:hover {
      color: #555;
      background: #fafafa;
    }
  `)}

  ${props => props.read ? 'opacity: .5' : ''}
`;
Item.Title = styled.h3`
  margin: 0;
  line-height: 1.5;
  list-style: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  ${props => !props.showDetail && (`
    ${Item}:hover & {
      color: #333;
    }
  `)}
`;
Item.TitleContent = styled.div`
  ${props => !props.showDetail && (`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  `)}
  margin-right: 8px;
`;
Item.PublishTime = styled.div`
  font-size: 12px;
  color: #888;
  font-weight: normal;
`;
Item.Summary = styled.div`
  margin-top: 10px;
  font-size: 12px;
  line-height: 18px;
  ${props => !props.showDetail && (`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    height: 54px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
  `)}
`;

const Topic = (props) => {
  return (
    <Item
      onClick={props.onClick ? () => props.onClick(props) : noop}
      read={props.read}
      showDetail={props.showDetail}
      as={props.as || 'div'}
    >
      <Item.Title title={props.title} showDetail={props.showDetail}>
        <Item.TitleContent showDetail={props.showDetail}>{props.title}</Item.TitleContent>
        <Item.PublishTime>{timeAgo(props.createdAt)}</Item.PublishTime>
      </Item.Title>
      <Item.Summary showDetail={props.showDetail}>{props.summary}</Item.Summary>
    </Item>
  )
};
Topic.defaultProps = {
  showDetail: true
}

const TopicList = (props) => {
  return (
    <List>
      {
        props.items.map(topic => (
          <Topic
            as='li'
            {...topic}
            key={topic.id}
            onClick={props.onClickItem || noop}
            read={(props.readIds || []).includes(topic.id)}
            showDetail={false}
          />
        ))
      }
    </List>
  )
};

const Footer = styled.div`
  position: absolute;
  width: 100px;
  height: 600px;
  left: 0;
  bottom: 0;
  visibility: hidden;
`;

const timeAgo = (anchor) => {
  let now = dayjs();
  return now.to(dayjs(anchor));
}

const Options = ({ dispatch, readhub }) => {
  const {
    topics,
    readIds,
    viewingId
  } = readhub;
  const footerRef = useRef(null);
  const viewingTopic = viewingId && topics.find(item => item.id === viewingId);

  useEffect(() => {
    dispatch({ type: 'readhub/fetchTopics' });
  }, [])

  useEffect(() => {
    let intersectionObserver = new IntersectionObserver((changes) => {
      if (!changes[0].isIntersecting) return;
      dispatch({ type: 'readhub/fetchTopics' });
    });
    intersectionObserver.observe(footerRef.current);
    return () => {
      intersectionObserver.disconnect();
    }
  }, []);

  return (
    <Page>
      <TopicList
        items={topics}
        readIds={readIds}
        onClickItem={(item) => {
          dispatch({ type: 'readhub/updateViewingId', payload: item.id })
          dispatch({ type: 'readhub/markRead', payload: item.id })
        }}
      />
      <Modal
        showCloseButton
        show={viewingId}
        textAlign='left'
        onClose={() => dispatch({ type: 'readhub/updateViewingId', payload: null })}
      >
        {viewingTopic && (
          <Topic {...viewingTopic} />
        )}
      </Modal>
      <Footer ref={footerRef} />
    </Page>
  );
}

export default connect(({ readhub }) => ({
  readhub,
}))(Options);