import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '../../Alert/Alert';

function RecommendFriends({ searchFriend, userData }) {
  const [friendList, setFriendList] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isClose, setIsClose] = useState(false);

  // 추천 친구 목록 API 호출
  const getRecommendFriendsList = async () => {
    try {
      const resp = await axios.get('/api/recommendFriends?searchRecommendFriend=' + search + '&userCode=' + user.userCode);
      const data = resp.data;
      
      setFriendList(data);
      setNoResults(data.length === 0);
    } catch (error) {
      setFriendList([]);
      setNoResults(true);
    }
  };

  useEffect(() => {
    if(searchFriend !== ''){
      setSearch(searchFriend);
    } else {
      setSearch(''); // 검색어가 없으면 전체 목록으로 설정
    }
  }, [searchFriend]);

  useEffect(() => {
    if(user !== null){
      getRecommendFriendsList();
    }
  }, [user, search]);

  useEffect(() => {
    if(userData !== null){
        setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if(reload === true){
      getRecommendFriendsList();
      setReload(false);
    }
  }, [reload]);

  // 친구 추가
  const handleAddFriend = async (e) => {
    if (userData.userCode !== null) {
      const friendCode = e.target.getAttribute('data-code');
      try {
        const resp = await axios.post('/api/addFriends', {
          userCode: userData.userCode, // 로그인한 유저의 userCode
          friendCode: friendCode, // 추가할 친구의 friendCode
        });
        
        if (resp.data === 'success') {
          setMessage('친구 추가 성공!');
          setIsClose(true);
          setReload(true);  // 성공하면 렌더링
        } else {
          setMessage('친구 추가 실패');
          setIsClose(true);
        }
      } catch (error) {
          setMessage('오류가 발생했습니다.');
          setIsClose(true);
      }
    }
  };

  const handleOnClose = () => {
    setIsClose(false);
  }

  return (
    <div>
      <div className="friendList">
        추천 친구 - {friendList.length}명
      </div>
      {friendList.length === 0 ? (
        <div>친구가 없습니다.</div> 
      ) : ( 
        friendList.map((fuser, index) => (
          <div key={index} className="friend-item">
            <div className='frSection'></div>
            <div className="friend-info">
              <img className="friend-chat-user-icon-friends" src={"http://192.168.0.140/uploadImg/userImg/" + fuser.userIcon} 
                alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png";}}/>  
              <div className="friend-nickName">{fuser.userNickName}</div>
            </div>
          <div className="friend-actions">
            <img
              data-code={fuser.userCode}
              onClick={handleAddFriend}
              src="https://img.icons8.com/material/24/FFFFFF/add-user-male--v1.png"
              alt="친구 요청"
              className="action-icon"
            />
          </div>
        </div>
        ))
      )}
      {isClose && <Alert message={message} onClose={handleOnClose}/>}
    </div>
  );
}
export default RecommendFriends;
