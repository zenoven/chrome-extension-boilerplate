import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Modal from './modal';
import styled from 'styled-components';
const Loading = (props) => {
  let style = {
    fontSize: props.size + 'px',
  }
  if (props.color) {
    style.color = props.color;
  }
  let root = document.documentElement;

  return (
    <Modal
      show
      hideMask={props.hideMask}
      width={'50px'}
      height={'50px'}
      background={'rgba(255,255,255,.3)'}
      onShow={() => root.classList && root.classList.add('loading')}
      onHide={() => root.classList && root.classList.remove('loading')}
    >
      <i className="icon icon-loading" style={style}></i>
    </Modal>
  )
};

Loading.propTypes = {
  hideMask: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
};

Loading.defaultProps = {
  hideMask: true,
  size: 20,
}
export default Loading;