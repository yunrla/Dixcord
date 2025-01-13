import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BodyListSection = styled.div`
    color: white;
    div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 7px 10px;
    }
    overflow-x: hidden; 
    cursor: pointer;
`;

const LoginStatus = styled.span`
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    width: 15px;
    height: 15px;
    transform: translate(240%, 110%);
    background-color: #01CD9A;
`;

function SideBar({user, refreshFriend, setRefreshFriend}) {
    const nav = useNavigate(); 
    const [friendList, setFriendList] = useState([]);
    const [getFriend, setFriend] = useState(0);
    const [roomNumber, setRoomNumber] = useState(0);
    const [reload, setReload] = useState(false);

    const getFriendList = async () => {
        try {
            const resp = await axios.get('/api/sideBarFriend?userCode=' + user.userCode);
            const data = resp.data;
            setFriendList(data);
        } catch (error) {
            console.error('친구 목록 가져오기 오류', error);
        }
    };

    useEffect(() => {
        if(reload === true){
            getFriendList();
            setReload(false);
            setRefreshFriend(prev => ({
                ...prev,
                userCode : 0,
                refresh : false
            }));
        }
    }, [reload]);

    // 친구 목록에 있는 유저의 상태가 바뀌었을 떄
    useEffect( () => {
        if(refreshFriend !== false && friendList.length > 0){
            let count = 0;
            friendList.forEach(friend => {
                if(friend.userCode === refreshFriend.userCode){
                count += 1;
                }       
            });
            if(count > 0){
                setReload(true);
            }
        }

    }, [refreshFriend]);
    
    // 처음 페이지가 로드됐을 때 친구목록 가져오기
    useEffect(() => {
        if(user.userCode !== null){
            getFriendList();
        }
    }, []);

    useEffect(() => {
        if(user.userSearchOption > 0){
            getFriendList();
        }
    }, [user]);
  
    // 친구의 채팅방 번호를 받아서 해당 채팅방으로 이동
    const handleChatRoom = (friendCode) => {
        if (friendCode !== undefined) {
            setFriend(friendCode);
            setRoomNumber(friendCode * user.userCode); // 1:1 채팅방 번호 생성
    
            // 클릭 시 알림 제거
            setRefreshFriend((prev) => ({
                ...prev,
                alertStatus: {
                    ...prev.alertStatus,
                    [friendCode]: false,
                },
            }));
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
                {friendList.map((user, index) => {  
                    return (
                        <div
                            key={index}
                            style={{ position: 'relative' }}
                            onClick={() => handleChatRoom(user.userCode)}  
                        >
                            <div>
                                <img className="friend-chat-user-icon-sideBar" src={"http://192.168.0.140/uploadImg/userImg/" + user.userIcon} 
                                    alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png";}}/>  
                                <LoginStatus style={user.userState === '온라인' ? { backgroundColor: '#01CD9A' } : { backgroundColor: 'silver' }} />
                            </div>
                            <div>{user.userNickName}</div>

                            {refreshFriend.alertStatus && refreshFriend.alertStatus[user.userCode] && (
                                <span className="chatAlarm"></span>
                            )}
                        </div>
                    );
                })}
            </BodyListSection>
        </div>
    );
}

export default SideBar;
