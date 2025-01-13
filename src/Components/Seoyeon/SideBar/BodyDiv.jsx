import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BodyListSection = styled.div`
    color: white;
    div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 7px 10px;
        margin-bottom: 5px;
        width: 100%; 
    }
    overflow-x: hidden; 
    cursor: pointer; // 전체 영역 클릭 가능하게 설정
`;

const LoginStatus = styled.span`
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    width: 15px;
    height: 15px;
    transform: translate(175%, 80%);
    background-color: #01CD9A;
`;

const BodyDiv = ({ friendList, user }) => {
    const nav = useNavigate(); 
    const [getFriend, setFriend] = useState(0);
    const [roomNumber, setRoomNumber] = useState(0);

    // 친구의 채팅방 번호를 받아서 해당 채팅방으로 이동
    const handleChatRoom = (friendCode) => {
        if (friendCode !== undefined) {
            setFriend(friendCode);
            setRoomNumber(friendCode * user.userCode);  // 1:1 채팅방 번호 생성
        } else {
            // console.error("친구 코드가 정의되지 않았습니다.");
        }
    };

    useEffect(() => {
        if (roomNumber !== 0) {
          try {
            axios.get(`/api/chatFriends?roomNumber=${roomNumber}&userCode=${user.userCode}&friendCode=${getFriend}`)
                  .then(resp => {
                    if (resp.data > 0) {
                      // 받아온 TextChatNo 저장
                      const textChatNo = resp.data;
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

    return (
        <div style={{ marginLeft: '-10px', flexGrow: '1', overflowY: 'auto' }}>
            <BodyListSection>
                {friendList.map((user, index) => {  // 로그 추가하여 friendCode 확인
                    return (
                        <div
                            key={index}
                            style={{ position: 'relative' }}
                            onClick={() => handleChatRoom(user.userCode)}  
                        >
                            <img 
                                src={"/images/seoyeon/user.png"} 
                                alt="아이콘" 
                                style={{ width: '40px', height: '40px', marginRight: '5px', verticalAlign: 'middle' }}
                            />
                            <LoginStatus style={user.userState === '온라인' ? { backgroundColor: '#01CD9A' } : { backgroundColor: 'silver' }} />
                            <div>{user.userNickName}</div>
                            <div>{user.userCode}</div>
                        </div>
                    );
                })}
            </BodyListSection>
        </div>
    );
};

export default BodyDiv;
