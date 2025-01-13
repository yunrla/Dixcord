import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ChatMessage from '../Hoyeon/ChatMessage';

const Container = styled.div`
    height: auto; /* 화면 전체 높이 */
    width: 78%;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 세로 중앙 정렬 */
    align-items: center; /* 가로 중앙 정렬 */
    margin: 10px;
`;

const HeaderArea = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const BodyArea = styled.div`
    width: 100%;
    height: 100%;
    flex: 1; /* 나머지 공간을 채우도록 설정 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FooterArea = styled.div`
    width: 100%;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
`;


function ChatRoom({ warnNkick, musicPlay, setSendMessage, roomNumber, user, chatbanstatus, banWordList, currentVideo, setBanWordList, setReloadState}) {

    const { pId } = useParams();
    const [getRoomNumber, setRoomNumber] = useState(0);
    const [roomData, setRoomData] = useState(null);

    useEffect( () => {
        if(Number(pId) !== 0){
            setRoomNumber(Number(pId));
        }
    }, [pId]);

    useEffect( () => {
        // 방 정보 가져오기
        if(getRoomNumber > 0){
            axios.get(`/api/room/chatRoomInfo/${getRoomNumber}`)
                .then(response => {
                    setRoomData(response.data);
                })
        }
    }, [getRoomNumber]);

    return (
        <Container>
            <HeaderArea>
            <div>                    
            {musicPlay && currentVideo ? (
                <div>                    
                <iframe
                    width="000"
                    height="000"
                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"                        
                ></iframe>
                </div>
                ) : (
                    null
                )}
                </div>
            </HeaderArea>

            <BodyArea>
                <ChatMessage warnNkick={warnNkick} roomNumber={getRoomNumber} user={user} chatbanstatus={chatbanstatus} banWordList={banWordList} setBanWordList={setBanWordList} roomData={roomData} setReloadState={setReloadState}/>
            </BodyArea>
        </Container>
    );
}

export default ChatRoom;