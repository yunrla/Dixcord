import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '../../Alert/Alert';

function WaitingFriends({ searchFriend, userData }) {
  const [friendList, setFriendList] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isClose, setIsClose] = useState(false);

  // 대기 중 친구 리스트 가져오기
  const getWaitingFriendsList = async () => {
    try {
      const response = await axios.get('/api/waitFriends?searchWaitFriend=' + search + '&friendCode=' + user.userCode);
      const data = response.data;
      setFriendList(data);
      setNoResults(data.length === 0); 
    } catch (error) {
      setFriendList([]); 
      setNoResults(true); 
    }
  };

  useEffect(() => {
    if(searchFriend !== '') {
      setSearch(searchFriend);
    } else {
      setSearch(''); // 검색어가 없으면 전체 목록으로 설정
    }
  }, [searchFriend]);

  useEffect(() => {
    if(user !== null){
      getWaitingFriendsList();
    } 
  }, [user, search]);

  useEffect(() => {
    if(userData !== null){
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if(reload === true){
      getWaitingFriendsList();
      setReload(false);
    }
  }, [reload]);

  // 나에게 요청한 친구 수락
  const handleAcceptFriend = async (fuser) => {
    try {
      const resp = await axios.post('/api/acceptFriends', fuser); // fuser 전달
      if (resp.data === 'success') {
        setMessage('수락 성공!');
        setIsClose(true);
        setReload(true);  // 성공하면 렌더링
      } else {
        setMessage('수락 실패');
        setIsClose(true);
      }
    } catch (error) {
      setMessage('오류가 발생했습니다. 다시 시도해주세요.');
      setIsClose(true);
    }
  };

  // 나에게 요청한 친구 거절
  const handleRejectFriend = async (fuser) => {
    if (userData.userCode !== null) {
      const friendCode = fuser.userCode; // fuser에서 friendCode 가져옴

      try {
        const resp = await axios.post('/api/rejectFriends', {
          userCode: userData.userCode, // 로그인한 유저의 userCode
          friendCode: friendCode, // 추가할 친구의 friendCode
        });

        if (resp.data === 'success') {
          setMessage('거절 성공!');
          setIsClose(true);
          setReload(true);  // 성공하면 렌더링
        } else {
          setMessage('거절 실패');
          setIsClose(true);
        }
      } catch (error) {
        setMessage('오류가 발생했습니다. 다시 시도해주세요.');
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
        대기 중 친구 - {friendList.length}명
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
                  onClick={() => handleAcceptFriend(fuser)}
                  src="https://img.icons8.com/material/24/FFFFFF/checkmark--v1.png"
                  alt="수락"
                  className="action-icon"
                />
                <img
                  data-code={user.userCode}
                  onClick={() => handleRejectFriend(fuser)}
                  src="https://img.icons8.com/material/24/FFFFFF/multiply--v2.png"
                  alt="거절"
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

export default WaitingFriends;
