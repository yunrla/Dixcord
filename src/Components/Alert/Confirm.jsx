import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #2f3136;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  animation: ${slideDown} 0.5s ease-out;
  top: 5%;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #01CD9A;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0ac960;
  }

  & + & {
    margin-left: 10px;
  }
`;

const Confirm = ({ message, onConfirm, onCancel }) => {
  return (
    <Overlay>
      <Modal>
        <p>{message}</p>
        <div>
          <Button onClick={onConfirm}>네</Button>
          <Button onClick={onCancel}>아니오</Button>
        </div>
      </Modal>
    </Overlay>
  );
};

export default Confirm;
