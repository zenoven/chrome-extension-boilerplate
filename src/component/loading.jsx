import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './modal';
import styled from 'styled-components';
const LoadingWrapper = styled.div`
  width: 100px;
  height: 100px;
  pointer-events: none;
`;
export default (props) => {
  let style = {
    fontSize: (props.size || 14) + 'px',
  }
  if (props.color) {
    style.color = props.color;
  }

  return (
    <Modal show hideMask={props.hideMask} width={'50px'} height={'50px'} background={'rgba(255,255,255,.3)'} >
      <i className="icon icon-loading" style={style}></i>
    </Modal>
  )
}