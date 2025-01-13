import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../../Css/Scroll.css';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import '../../../Css/FriendCss.css';

const FriendListArea = styled.div``;

function FriendList({ friendList = [], noResults, activeTab, userData, setReload }) {
  const totalFriends = friendList.length;
  const nav = useNavigate();
  const [getFriendList, setFriendList] = useState([]);
  const [roomNumber, setRoomNumber] = useState(0);

  // 모든 친구
  // 채팅방 이동
  // const handleChatRoom = (e) => {
  //   const friendCode = e.target.getAttribute('data-code');
  //   setRoomNumber(friendCode * userData.userCode);  // 1:1 채팅방 번호 생성
  // };
  
  // useEffect(() => {
  //   if (roomNumber !== 0) {
  //     try {
  //       axios.get('/api/chatFriends?roomNumber=' + roomNumber)
  //             .then(resp => {
  //               console.log("전체 응답: ", resp.data);
  //               if (resp.data > 0) {
  //                 // 받아온 TextChatNo 저장
  //                 const textChatNo = resp.data;
  //                 console.log("textChatNo : " + textChatNo);
  //                 // 채팅 내역으로 이동
  //                 nav(`/friendChat/${textChatNo}`);
  //               } else {

  //               }
  //             })
  //             .catch(err => console.error(err));
        
  //     } catch (error) {
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // }, [roomNumber]);

  // // 기타 버튼
  // const handleEtc = (e) => {
  //   setIsModalOpen(true);
  // };
  
  // // 모달 닫기
  // const closeModal = () => {
  //   setIsModalOpen(false);  // 모달 닫기
  // };
  
  // // 친구 삭제
  // const handleDeleteFriend = async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("친구 코드 : " + friendCode);
  //     try {
  //       const resp = await axios.post('/api/deleteFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('친구 삭제 성공!');
  //         setReload(true);  // 성공하면 렌더링
  //       } else {
  //         alert('친구 삭제 실패');
  //       }
  //     } catch (error) {
  //       console.error('친구 추가 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // 추천 친구
  // 친구 추가
  // const handleAddFriend = async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("친구 코드 : " + friendCode);
  //     try {
  //       const resp = await axios.post('/api/addFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('친구 추가 성공!');
  //         setReload(true);  // 성공하면 렌더링
  //       } else {
  //         alert('친구 추가 실패');
  //       }
  //     } catch (error) {
  //       console.error('친구 추가 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // 요청 친구
  // 내가 친구 요청한 것 취소 
  // const handleCancelFriend = async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("요청 친구 코드 : " + friendCode);
  //     console.log("userCode:", userData.userCode);
      
  //     try {
  //       const resp = await axios.post('/api/cancelFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('요청 취소 성공!');
  //         setReload(true);  // 성공하면 렌더링
          
  //       } else {
  //         alert('요청 취소 실패');
  //       }
  //     } catch (error) {
  //       console.error('요청 취소 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // 대기 중 친구
  // 나에게 요청한 친구 수락
  // const handleAcceptFriend = async ({user}) => {
  //   console.log(user);
  //   try {
  //     const resp = await axios.post('/api/acceptFriends', user);
      
  //     if (resp.data === 'success') {
  //       alert('수락 성공!');
  //       setReload(true);  // 성공하면 렌더링
        
  //     } else {
  //       alert('수락 실패');
  //     }
  //   } catch (error) {
  //     console.error('요청 취소 오류:', error);
  //     alert('오류가 발생했습니다. 다시 시도해주세요.');
  //   }
  // };
  
  // 나에게 요청한 친구 거절
  // const handleRejectFriend = async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("대기 중 친구 코드 : " + friendCode);
  //     console.log("userCode:", userData.userCode);
      
  //     try {
  //       const resp = await axios.post('/api/rejectFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('거절 성공!');
  //         setReload(true);  // 성공하면 렌더링
          
  //       } else {
  //         alert('거절 실패');
  //       }
  //     } catch (error) {
  //       console.error('요청 취소 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // 친구 차단
  // const handleLockFriend=  async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("친구 코드 : " + friendCode);
  //     try {
  //       const resp = await axios.post('/api/lockFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('차단 성공!');
  //         setReload(true);  // 성공하면 렌더링
  //       } else {
  //         alert('차단 실패');
  //       }
  //     } catch (error) {
  //       console.error('차단 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // 친구 차단 해제
  // const handleUnlockFriend = async (e) => {
  //   if (userData.userCode !== null) {
  //     const friendCode = e.target.getAttribute('data-code');
  //     console.log("친구 코드 : " + friendCode);
  //     try {
  //       const resp = await axios.post('/api/unlockFriends', {
  //         userCode: userData.userCode, // 로그인한 유저의 userCode
  //         friendCode: friendCode, // 추가할 친구의 friendCode
  //       });
        
  //       if (resp.data === 'success') {
  //         alert('차단 해제 성공!');
  //         setReload(true);  // 성공하면 렌더링
  //       } else {
  //         alert('차단 해제 실패');
  //       }
  //     } catch (error) {
  //       console.error('차단 해제 오류:', error);
  //       alert('오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   }
  // };
  
  // useEffect( () => {
  //   if(friendList.length !== getFriendList.length){
  //     setFriendList(friendList);
  //   }
  // }, [friendList]);
  
  return (
    <FriendListArea>
  <div className="friend-list-header">
    {activeTab === 'all'
      ? getFriendList.length > 0 && `모든 친구 - ${totalFriends}명`
      : activeTab === 'wait'
      ? `대기 중인 친구 - ${totalFriends}명`
      : activeTab === 'recommend'
      ? `추천 친구 - ${totalFriends}명`
      : activeTab === 'request'
      ? `요청한 친구 - ${totalFriends}명`
      : activeTab === 'block'
      ? `차단된 친구 - ${totalFriends}명`
      : null}
  </div>
  {noResults ? (
    <div>친구가 없습니다.</div>
  ) : activeTab === 'add' ? <div>친구추가하는탭</div> : (
    <div className={`friend-list ${friendList.length > 10 ? 'scrollable' : ''}`}>
      {getFriendList.map((user, index) => (
        <div key={index} className="friend-item">
          <div className="friend-info">
            <img src={'/images/user.png'} alt="아이콘" className="friend-icon" />
            <div className="friend-details">
              <div>{user.userNickName}</div>
              <div>{user.userCode}</div>
              {activeTab !== 'recommend' && <div>{user.friendCode}</div>}
              <div>{user.userState}</div>
              <div>{user.friendAuth}</div>
            </div>
          </div>
{/* 
          {activeTab === 'all' && (
            <div className="friend-actions">
              <img
                data-code={user.friendCode}
                onClick={handleChatRoom}
                src="https://img.icons8.com/material/24/FFFFFF/speech-bubble-with-dots.png"
                alt="채팅방 이동"
                className="action-icon"
              />
              <img
                onClick={handleEtc}
                src="https://img.icons8.com/material/24/FFFFFF/menu-2--v1.png"
                alt="기타"
                className="action-icon"
              />
            </div>
          )} */}

          {/* 모달 */}
          {/* {isModalOpen && (
            <div
              id="modalOverlay"
              onClick={(e) => {
                if (e.target.id === "modalOverlay") closeModal();
              }}
              className="modal-overlay"
            >
              <div className="modal-content">
                <button
                  data-code={user.friendCode}
                  onClick={handleLockFriend}
                  className="modal-button"
                >
                  친구 차단하기
                </button>
                <button
                  data-code={user.friendCode}
                  onClick={handleDeleteFriend}
                  className="modal-button"
                >
                  친구 삭제하기
                </button>
              </div>
            </div>
          )} */}

          {/* {activeTab === 'recommend' && (
            <img
              data-code={user.userCode}
              onClick={handleAddFriend}
              src="https://img.icons8.com/material/24/FFFFFF/add-user-male--v1.png"
              alt="친구 요청"
              className="action-icon"
            />
          )} */}

          {/* {activeTab === 'request' && (
            <img
              data-code={user.friendCode}
              onClick={handleCancelFriend}
              src="https://img.icons8.com/material/24/FFFFFF/delete-user-male.png"
              alt="요청 취소"
              className="action-icon"
            />
          )} */}

          {/* {activeTab === 'wait' && (
            <div className="friend-actions">
              <img
                onClick={() => handleAcceptFriend({ user })}
                src="https://img.icons8.com/material/24/FFFFFF/checkmark--v1.png"
                alt="수락"
                className="action-icon"
              />
              <img
                data-code={user.userCode}
                onClick={handleRejectFriend}
                src="https://img.icons8.com/material/24/FFFFFF/multiply--v2.png"
                alt="거절"
                className="action-icon"
              />
            </div>
          )} */}

          {/* {activeTab === 'block' && (
            <img
              data-code={user.friendCode}
              onClick={handleUnlockFriend}
              src="https://img.icons8.com/material/24/FFFFFF/user-lock.png"
              alt="차단 해제"
              className="action-icon"
            />
          )} */}
        </div>
      ))}
    </div>
  )}
</FriendListArea>

  );
}

export default FriendList;

