import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SideLeftCreateRoom1 from './SideLeftCreateRoom1';
import SideLeftCreateRoom2 from './SideLeftCreateRoom2';

const Container = styled.div`
height: auto;
overflow-y: hidden;
border:1px solid #5f5f5f;
text-align: center;  
background-color:white;
padding: 10px;
padding-top: 10px;
display: flex;
flex-direction: column;
align-items: center; /* 가로 중앙 정렬 */
justify-content: flex-start; /* 세로 상단 정렬 */

`
const RoomDiv = styled.div`
    
`
const RoomCreateDiv = styled.div`
    
`
const Button = styled.button`
    
`
const RoomSelectDiv = styled.div`
    
`
const Circle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex; 
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비율 유지하며 영역 꽉 채움 */
    border-radius: 50%; /* 이미지도 원형으로 */
    position: absolute;
  }
`
const Circle1 = styled(Circle)`
    background-color:#d6d4d4;
    background-image: url('//192.168.0.140/uploadImg/logo.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`

const Circle2 = styled(Circle1)`
    width: 50px; 
    height: 50px;
    background-color:#4d4c4c;    
    margin: 0 auto;
    background-image: url('//192.168.0.140/uploadImg/plus.jpg');

    
`
const Circle3 = styled(Circle2)`
    margin: 10px auto; 
    background-image: url('//192.168.0.140/uploadImg/compass.png');

`
const Li = styled.li`
    list-style-type:none;
    margin-bottom:10px;

`

const Divlist = styled.div`
    margin-bottom:10px;
`;

const Ul = styled.ul`
    padding: 0;
    
    

`








function SideBarLeftArea({ data, rightSide, roomStatus, setRoomNum}) {


    const [chatList, setChatList] = useState([]);

    const getChatList = async () => {
        const response = await axios.get(`/api/room/getChatList/${data.userCode}`);
        const result = await response.data;
        setChatList(result);
    }
    useEffect(() => {
        if (data !== null) {

            getChatList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [creatRoom, setCreateRoom] = useState(false);

    const nav = useNavigate();



    const handleOnclickRoom = (e) => {
        // rightSide('room');
        // nav('/room/' + e.target.getAttribute('num'));
        // roomStatus('chatRoom');

        // setRoomNum(e.target.getAttribute('num'));
    }


    const handleOnclickLogo = () => {
        rightSide('friend');
        roomStatus('main');
    }

    const handleCreateRoom = () => {
        setCreateRoom(true);
    }

   


    return (
        <>
            <Container>
                <RoomDiv>
                        {chatList.map(list => (
                            <Divlist key={list.roomNumber}>
                                <Circle num={list.roomNumber} onClick={handleOnclickRoom}>
                                    <img
                                        src={`/${list.roomIcon}`}
                                        alt={`${list.roomNumber}`}
                                        num={list.roomNumber}
                                        onClick={handleOnclickRoom}
                                    />
                                </Circle>                    
                            </Divlist>
                        ))}
                        <Circle2 onClick={handleCreateRoom}></Circle2>
                        <Circle3></Circle3>
                </RoomDiv>
            </Container>

            <SideLeftCreateRoom1 data={data} create={creatRoom} create1={setCreateRoom} />

        </>

    );
}

export default SideBarLeftArea;