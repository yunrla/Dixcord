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

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
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

const Button = styled.button`
  background-color: #7289da;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5f73b1;
  }

  & + & {
    margin-left: 10px;
  }
`;

function Modal({ isOpen, message, onClose, onConfirm, hideCloseButton }) {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <p>{message}</p>
                <div>
                    {onConfirm && <Button className="confirm" onClick={onConfirm}>확인</Button>}
                    {!hideCloseButton && (
                        <Button className="close" onClick={onClose}>닫기</Button>
                    )}
                </div>
            </ModalContent>
        </ModalOverlay>
    );
}

export default Modal;
