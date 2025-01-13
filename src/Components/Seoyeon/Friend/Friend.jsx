import React, { useState } from 'react';
import AllFriends from './AllFriends';
import RecommendFriends from './RecommendFriends';
import WaitingFriends from './WaitingFriends'; 
import styled from 'styled-components';
import RequestFriends from './RequestFriends';
import BlockFriend from './BlockFriend';
import AddFriends from './AddFriends';

const FriendArea = styled.div`
  padding-left: 30px;
  width: 100%; 
  box-sizing: border-box;
  background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    margin: 10px;
    margin-left: 0;
    border-radius: 10px;
  color: white;
  overflow: auto;
`;

const HeaderDiv = styled.div``;

const BodyDiv = styled.div``;

const LeftBtnDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 20px;

  h3 {
    font-size: 25px;
  }

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    margin-top: 7px;
    margin-left: 15px;
    padding: 8px 14px; 
    font-size: 20px;
    position: relative;
    color: #DBDEE1;
    z-index: 1;
    height: 40px;  
    line-height: 24px;  
    border-radius: 3px; 
    box-sizing: border-box;  

    &.active {
      background-color: rgba(49, 50, 54, 0.6);
    }

    &.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 70%;  
      z-index: -1;
    }
  }
`;

const LeftDiv = styled.div`
  position: relative;

  input {
    width: 98%; 
    height: 40px; 
    margin-left: 3px;
    padding-left: 10px;
    padding-right: 40px;
    border-radius: 5px;
    border: none;
    background-color: #1E1F22;
    color: #DBDEE1;
    outline: none;
    box-sizing: border-box;
  }

  ::placeholder {
    color: #888686; 
    font-size: 15px;
  }

  button {
    position: absolute;
    top: 50%;
    right: 40px; 
    transform: translateY(-50%); 
    background-color: transparent;
    border: none;
    color: #DBDEE1;
    cursor: pointer;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border-radius: 50%; /* 동그란 버튼 */
    padding: 0;
  }
`;


function Friend({ userData, setUser, refreshFriend, setRefreshFriend }) {
  const [inputSearchFriend, setInputSearchFriend] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 탭 상태: 모두, 추천, 요청, 대기 중

  // 검색어 입력 시
  const handleChangeInput = (e) => {
    setInputSearchFriend(e.target.value);
  };

  // 탭 클릭 시 active 상태 업데이트
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <FriendArea className='backgCon'>
      <HeaderDiv>
        <LeftBtnDiv>
          <img 
              src={"/images/seoyeon/userFriends.png"} 
              alt="아이콘" 
              style={{ width: '50px', height: '50px', marginTop: '3px', marginRight: '5px', verticalAlign: 'middle' }}
          />
          <h3>친구</h3>
          <button 
            className={activeTab === 'all' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('all')}>모두</button>
          <button 
            className={activeTab === 'recommend' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('recommend')}>추천</button>
          <button 
            className={activeTab === 'request' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('request')}>요청</button>
          <button 
            className={activeTab === 'wait' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('wait')}>대기 중</button>
          <button 
            className={activeTab === 'block' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('block')}>차단</button>
          <button 
            className={activeTab === 'add' ? 'active' : 'textCol'} 
            onClick={() => handleTabClick('add')}>친구 추가</button>
        </LeftBtnDiv>
      </HeaderDiv>

      <BodyDiv>
        {activeTab !== 'add' && (
          <LeftDiv>
            <div style={{ position: 'relative'}}>
              <input
                type="text"
                value={inputSearchFriend}
                onChange={handleChangeInput}
                placeholder="검색하기"
              />
              <button onClick={() => setInputSearchFriend('')}>X</button> 
            </div>
          </LeftDiv>
        )}

        {activeTab === 'all' && <AllFriends searchFriend={inputSearchFriend} userData={userData} settUser={setUser} refreshFriend={refreshFriend} setRefreshFriend={setRefreshFriend}/>}
        {activeTab === 'recommend' && <RecommendFriends searchFriend={inputSearchFriend} userData={userData}/>}
        {activeTab === 'request' && <RequestFriends searchFriend={inputSearchFriend} userData={userData}/>}
        {activeTab === 'wait' && <WaitingFriends searchFriend={inputSearchFriend} userData={userData}/>}
        {activeTab === 'block' && <BlockFriend searchFriend={inputSearchFriend} userData={userData}/>}
        {activeTab === 'add' && <AddFriends searchFriend={inputSearchFriend} userData={userData}/>}
      </BodyDiv>
    </FriendArea>
  );
}

export default Friend;
