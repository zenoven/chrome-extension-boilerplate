import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

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
  width: ${props => props.width || '300px'};
  text-align: ${props => props.textAlign || 'center'};
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0,0,0, .3);
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
export default (props) => {
  if (!props.show) return null;
  return ReactDOM.createPortal(
    <Wrapper>
      <Mask onClick={props.onClose} />
      <Main width={props.width}>
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