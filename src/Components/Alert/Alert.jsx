import React, { useState } from 'react';
import styled from 'styled-components';

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
`;

const Button = styled.button`
  background-color: #7289da;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5f73b1;
  }
`;

const Alert = ({ message, onClose }) => {
  return (
    <Overlay>
      <Modal>
        <p>{message}</p>
        <Button onClick={onClose}>OK</Button>
      </Modal>
    </Overlay>
  );
};

export default Alert;
