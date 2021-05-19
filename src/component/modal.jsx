import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {noop} from 'lib/util'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Mask = styled(Wrapper)`
  position: absolute;
  background: rgba(0,0,0,.3);
`;
const Main = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${props => props.width };
  height: ${props => props.height};
  text-align: ${props => props.textAlign};
  transform: translate(-50%, -50%);
  background: ${props => props.background};
  padding: 20px;
  border-radius: 4px;
  ${props => (
  !props.hideBoxShadow && `
    box-shadow: 0 0 5px rgba(0,0,0, .3);
  `
  )}
`;
const CloseButton = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  width: 12px;
  height: 12px;
  padding: 4px;
  cursor: pointer;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background: rgba(0,0,0, .3);
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  &:hover {
    &::before,
    &::after {
      background: rgba(0,0,0, .8);
    }
  }
  &::before {
    width: 1px;
    height: 70%;
  }
  &::after {
    height: 1px;
    width: 70%;
  }
`;
const Modal = (props) => {
  useEffect(() => {
    let root = document.documentElement;
    let method = props.show ? 'add' : 'remove';
    root.classList[method]('with-modal-show');
    props.onShow && props.onShow();
    return () => {
      root.classList.remove('with-modal-show');
      props.onHide && props.onHide();
    };
  });
  if (!props.show) return null;
  return ReactDOM.createPortal(
    <Wrapper>
      {
        !props.hideMask && <Mask onClick={props.onClose} />
      }
      <Main
        width={props.width}
        height={props.height}
        textAlign={props.textAlign}
        hideBoxShadow={props.hideMask}
        background={props.background}
        >
        {props.showCloseButton && (
          <CloseButton
            onClick={props.onClose}
          />
        )}
        {props.children}
      </Main>
    </Wrapper>,
    document.body);
}

Modal.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  textAlign: PropTypes.string,
  background: PropTypes.string,
  hideMask: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onClose: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
};

Modal.defaultProps = {
  width: '300px',
  height: 'auto',
  textAlign: 'center',
  background: '#fff',
  hideMask: false,
  showCloseButton: false,
  onClose: noop,
}
export default Modal;
