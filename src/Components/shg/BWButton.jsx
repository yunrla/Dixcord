import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  button {
    width: 110px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background: #e62222;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* 전환 효과 추가 */
  }

  button, button span {
    transition: 200ms; /* 기본 전환 효과 */
  }

  button .text {
    transform: translateX(10px); /* 텍스트 위치 */
    color: white;
    font-weight: bold;
    transition: color 0.2s ease-in-out, transform 0.2s ease-in-out; /* 텍스트 전환 효과 */
  }

  button .icon {
    position: absolute;
    border-left: 1px solid #c41b1b;
    transform: translateX(60px); /* 아이콘 초기 위치 */
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease-in-out, width 0.2s ease-in-out, border-left 0.2s ease-in-out; /* 아이콘 전환 효과 */
  }

  button svg {
    width: 15px;
    fill: #eee;
    transition: transform 0.2s ease-in-out; /* 아이콘 크기 전환 효과 */
  }

  button:hover {
    background: #ff3636; /* 배경색 변화 */
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2); /* 그림자 변화 */
  }

  button:hover .text {
    color: transparent; /* 텍스트 숨기기 */
    transform: translateX(0); /* 텍스트 이동 */
  }

  button:hover .icon {
    width: 100px; /* 아이콘 확장 */
    border-left: none; /* 테두리 제거 */
    transform: translateX(0); /* 아이콘 이동 */
  }

  button:focus {
    outline: none;
  }

  button:active .icon svg {
    transform: scale(0.8); /* 클릭 시 아이콘 축소 */
    transition: transform 0.1s ease-in-out; /* 클릭 시 전환 효과 */
  }
`;

const BWButton = ({ text, onClick, icon }) => (
  <StyledWrapper>
    <button onClick={onClick}>
      <span className="text">{text}</span>
      <span className="icon">{icon}</span>
    </button>
  </StyledWrapper>
);

export default BWButton;
