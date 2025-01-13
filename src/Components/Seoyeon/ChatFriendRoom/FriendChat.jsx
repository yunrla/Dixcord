import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessage from '../../Hoyeon/ChatMessage';
import axios from 'axios';

function FriendChat({ user, setUser }) {
    const { textChatNo } = useParams();
    const [getRoomNumber, setRoomNumber] = useState(0);
    const [friend, setFriend] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (Number(textChatNo) > 0 && getRoomNumber !== Number(textChatNo)) {
            setRoomNumber(Number(textChatNo));
            const friendNum = Number(textChatNo) / user.userCode;
            axios.get('/user/api/getUserData?userCode=' + friendNum)
                .then(response => {
                    setUser(prev => ({
                        ...prev,
                        userSearchOption : 0
                      }));
                    setFriend(response.data);
                })
                .catch(err => console.log(err));
        }
    }, [textChatNo]);
    
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    return (
        <div className="friend-chat-container">
            <div className="friend-chat-body-area">
                {friend !== null && <ChatMessage friend={friend} roomNumber={getRoomNumber} user={user} chatType={'friend'} />}
            </div>
            {friend !== null &&
                <div className="friend-chat-right-sidebar backgCon">
                    {/* <div 
                        className="friend-chat-user-icon-container" 
                        style={{ 
                            backgroundImage: `url(http://192.168.0.140/uploadImg/userImg/${friend.backGroundImg || '../../../backgroundImg.jpg'})` 
                        }} 
                    /> */}
                    <div className="friend-chat-user-icon-container">
                        <img 
                            className="background-image" 
                            src={`http://192.168.0.140/uploadImg/userImg/${friend.backGroundImg}`} 
                            alt="" 
                            onError={(e) => { e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/friendChat_Forest_Bg.jpg"; }} 
                        />
                    </div>

                    <img className="friend-chat-user-icon" src={"http://192.168.0.140/uploadImg/userImg/" + friend.userIcon} 
                        alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png";}}/>
                    <div className="friend-chat-user-nickname">{friend.userNickName}</div>
                    <div className="friend-chat-register-date">
                        <div>가입 날짜</div>
                        <div>{formatDate(friend.registerDate)}</div>
                    </div>
                </div>
            }
        </div>
    );
}

export default FriendChat;
