import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../Css/FriendCss.css';
import styled from 'styled-components';
import Alert from '../../Alert/Alert';

const LoginStatus = styled.span`
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    width: 15px;
    height: 15px;
    transform: translate(250%, 95%);
    background-color: #01CD9A;
`;

function AllFriends({ searchFriend, userData, settUser, refreshFriend, setRefreshFriend }) {
  const nav = useNavigate();
  const [friendList, setFriendList] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [roomNumber, setRoomNumber] = useState(0);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // 모달 위치 상태
  const [getFriend, setFriend] = useState(0);
  const [message, setMessage] = useState('');
  const [isClose, setIsClose] = useState(false);
  // const [deleteFriend, setDeleteFriend] = useState(null);

  // 전체 친구 목록 API 호출
  const getFriendList = async () => {
    try {
      const resp = await axios.get('/api/friendAreaList?searchFriend=' + search + '&userCode=' + user.userCode);
      const data = resp.data;
      setFriendList(data);
      setNoResults(data.length === 0);
    } catch (error) {
      setFriendList([]);
      setNoResults(true);
    }
  };

  // 검색어가 있을때만 setSearch
  useEffect(() => {
    if (searchFriend !== '') {
      setSearch(searchFriend); // 검색어가 있으면 search 상태 업데이트
    } else {
      setSearch(''); // 검색어가 없으면 전체 목록으로 설정
    }
  }, [searchFriend]);
  
  // user가 있을때만 리스트 출력
  useEffect(() => {
    if (user !== null) {
      getFriendList();
    }
  }, [user, search]);

  useEffect(() => {
    if(userData !== null){
        setUser(userData);
    }
  }, [userData]);
  
  useEffect(() => {
    if(reload === true){
      getFriendList();
      setReload(false);
      setRefreshFriend({
        userCode : 0,
        refresh : false
      });
    }
  }, [reload]);

  useEffect( () => {
    if(friendList.length !== getFriendList.length){
      setFriendList(friendList);
    }
  }, [friendList]);

  // 채팅방 이동
  const handleChatRoom = (e) => {
    const friendCode = Number(e.target.getAttribute('data-code'));
    setFriend(friendCode);
    setRoomNumber(friendCode * userData.userCode);  // 1:1 채팅방 번호 생성
  };
  
  useEffect(() => {
    if (roomNumber !== 0) {
      try {
        axios.get(`/api/chatFriends?roomNumber=${roomNumber}&userCode=${userData.userCode}&friendCode=${getFriend}`)
              .then(resp => {
                if (resp.data > 0) {
                  // 받아온 TextChatNo 저장
                  const textChatNo = resp.data;
                  settUser(prev => ({
                    ...prev,
                    userSearchOption : 5
                  }));
                  // 채팅 내역으로 이동
                  nav(`/friendChat/${roomNumber}`);
                } else {

                }
              })
              .catch(err => console.error(err));
        
      } catch (error) {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }, [roomNumber]);

  // 기타 버튼
  const handleEtc = (e) => {
    setFriend(Number(e.target.getAttribute('data-code')))
    const buttonRect = e.target.getBoundingClientRect(); 
    const modalTop = buttonRect.top + window.scrollY + 40; 
    const modalLeft = buttonRect.left + window.scrollX - 70; 
    setModalPosition({ top: modalTop, left: modalLeft }); 
    setIsModalOpen(true);
  };
  
  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);  // 모달 닫기
  };
  
  // 친구 삭제
  const handleDeleteFriend = async (e) => {
    closeModal();
    if (userData.userCode !== null) {
      const friendCode = Number(e.target.getAttribute('data-code'));
      try {
        const resp = await axios.post('/api/deleteFriends', {
          userCode: userData.userCode, // 로그인한 유저의 userCode
          friendCode: friendCode, // 추가할 친구의 friendCode
        });

        if (resp.data === 'success') {
          // alert('친구 삭제 성공!');
          setMessage('친구 삭제 성공!');
          setIsClose(true);
          setRefreshFriend({
            refresh : true,
            userCode : friendCode
          });
          setFriend(0);
        } else {
          setMessage('친구 삭제 실패');
          setIsClose(true);
        }
      } catch (error) {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 친구 차단
  const handleLockFriend=  async (e) => {
    closeModal();
    if (userData.userCode !== null) {
      const friendCode = e.target.getAttribute('data-code');
      try {
        const resp = await axios.post('/api/lockFriends', {
          userCode: userData.userCode, // 로그인한 유저의 userCode
          friendCode: friendCode, // 추가할 친구의 friendCode
        });
        
        if (resp.data === 'success') {
          // alert('차단 성공!');
          setMessage('차단 성공!');
          setIsClose(true);
          setReload(true);  // 성공하면 렌더링
        } else {
          setMessage('차단 실패!');
          setIsClose(true);
        }
      } catch (error) {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleOnClose = () => {
    setIsClose(false);
  }

  // 친구 목록에 있는 유저의 상태가 바뀌었을 떄
  useEffect( () => {
    if(refreshFriend !== false && friendList.length > 0){
      let count = 0;
      friendList.forEach(friend => {
        if(friend.friendCode === refreshFriend.userCode){
          count += 1;
        }       
      });
      if(count > 0){
        setReload(true);
      }
    }
  }, [refreshFriend]);

  return (
    <div>
      <div className="friendList">
        모든 친구 - {friendList.length}명
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
              <LoginStatus
                style={fuser.userState === '온라인' ? {backgroundColor : '#01CD9A'} : {backgroundColor : 'silver'}}
              ></LoginStatus>
              <div className="friend-details">
                <div>{fuser.userNickName}</div>
                <div>{fuser.friendAuth}</div>
              </div>
            </div>
            <div className="allFriend-actions">
              <img
                data-code={fuser.friendCode}
                onClick={handleChatRoom}
                src="https://img.icons8.com/material/24/FFFFFF/speech-bubble-with-dots.png"
                alt="채팅방 이동"
                className="action-icon"
              />
              <img
                data-code={fuser.friendCode}
                onClick={(e) => handleEtc(e, fuser)}
                src="https://img.icons8.com/material/24/FFFFFF/menu-2--v1.png"
                alt="기타"
                className="action-icon"
              />
            </div>
          </div>
        ))
      )}
      {isModalOpen && (
        <div
          id="modalOverlay"
          onClick={(e) => {
            if (e.target.id === "modalOverlay") closeModal();
          }}
          className="modal-overlay"
        >
          <div
            className="modal-content"
            style={{ top: modalPosition.top, left: modalPosition.left }}
          >
            <button
              data-code={getFriend}
              onClick={handleLockFriend}
              className="modal-button lock-button"
            >
              친구 차단하기
            </button>
            <button
              data-code={getFriend}
              onClick={handleDeleteFriend}
              className="modal-button"
            >
              친구 삭제하기
            </button>
          </div>
        </div>
      )}
      {isClose && <Alert message={message} onClose={handleOnClose}/>}
    </div>
  );
  
}

export default AllFriends;
