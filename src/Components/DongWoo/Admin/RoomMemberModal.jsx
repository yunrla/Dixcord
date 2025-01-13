import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

function RoomMemberModal({ members, onClose }) {

  return (
    <ModalBackground>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h3>방 멤버 목록</h3>
        <MemberList>
          {members.length > 0 ? (
            members.map((m, index) => (
              <MemberItem key={index}>
                <span>{m.userCode}</span>
                <span>{m.userEmail}</span>
                <span>{m.userName}</span>
                <span>{m.userNickName}</span>
              </MemberItem>
            ))
          ) : (
            <p>멤버가 없습니다.</p>
          )}
        </MemberList>
      </ModalContainer>
    </ModalBackground>
  );
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #1d1d1d;
  color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

const MemberList = styled.div`
  margin-top: 10px;
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #444;
  flex-wrap: wrap; /* 텍스트가 길어져도 다음 줄로 넘어가도록 처리 */

  &:last-child {
    border-bottom: none;
  }
`;

const MemberItemSpan = styled.span`
  display: flex;
  flex: 1;
  min-width: 100px; /* 최소 너비 설정 */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export default RoomMemberModal;
