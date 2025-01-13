import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SideLeftCreateRoom1 from '../ChatRoom/SideLeftCreateRoom1';

function Main({data, latestRoom, setSideBarStatus, ws, setRoomNum }) {

    const [user, setUser] = useState(null); // 로그인한 유저 정보

    const [roomList, setRoomList] = useState([]); // 방 리스트

    const [latestRooms, setLatestRooms] = useState([]); // 최근 참가한 방 리스트

    const [creatRoom3, setCreateRoom3] = useState(false);

    const [creatRoom, setCreateRoom] = useState(false);

    const [backStatus, setBackStatus] = useState(false);

    const shortText = ['다양한 장르의 게임을 함께 즐기며, 전략과 팁을 공유하고, 친구들과 협력하는 재미를 만끽하는 게임 커뮤니티입니다.', 
        '좋아하는 음악을 함께 듣고, 다양한 장르에 대한 의견을 나누며, 새로운 아티스트와 곡을 추천하는 음악 애호가들의 공간입니다.', 
        '맛있는 음식 추천부터 요리 비법까지, 각국의 음식 문화와 레시피를 공유하며, 식도락 여행을 떠나는 듯한 기분을 느낄 수 있는 곳입니다.', 
        '창의적인 아이디어를 바탕으로 다양한 프로젝트를 진행하고, 서로의 경험을 공유하며, 팀워크를 통해 멋진 결과를 만드는 프로젝트 공간입니다.', 
        '전 세계의 여행지와 명소를 추천하고, 여행 경험과 꿀팁을 나누며, 함께 떠날 여행지를 계획하는 여행 애호가들의 모임입니다.', 
        '최신 경제 동향과 투자 정보, 금융에 대한 다양한 이야기를 나누며, 경제적 자유를 추구하는 사람들을 위한 경제 토론 공간입니다.'];

    const nav = useNavigate();

    // 모든 채팅 방 리스트 가져오는 함수
    const getRoomList = () => {
        axios.get('/api/room/allList')
            .then(response => {
                // 전달받은 방 리스트 저장
                setRoomList(response.data.filter(room => room.roomNumber < 9999));
            })
            .catch(err => console.error(err));
    }

    // 유저 정보를 저장하거나 저장됬을 때 실행하는 이펙트
    useEffect( () => {
        // 전달받은 data가 값이 존재하면서, user가 비어있을 때만 값을 저장하기 
        if(data !== null && user === null){
            setUser(data);
        }
        // 유저 정보가 저장되면 모든 방 조회하는 함수 실행
        if(user !== null){
            getRoomList();
        }
    }, [data, user]);

    // 방 리스트가 저장되면 실행하는 이펙트
    useEffect(() => {
        if (roomList.length > 0 && latestRoom.length > 0) {
            // 최신 방 정보 임시 저장
            const filteredRooms = roomList.filter(room => latestRoom.includes(room.roomNumber));
            
            // 최근 입장한 방 정보 저장
            setLatestRooms(filteredRooms);
        }
    }, [roomList, latestRoom]);

    useEffect( () => {
        
    }, [latestRooms]);
    

    const handleClickAddFriend = (e) => {
        // 친구 추가 혹은 친구 추천 탭으로 이동
        setSideBarStatus('friend');
        nav('/friend');
    }

    const handleClickCreateRoom = (e) => {
        // 방 생성 모달 띄워주기
        setCreateRoom(true);
    }

    const handleClickGoRoom = e => {
        const roomNumber = e.currentTarget.getAttribute('data-list');
        const roomData = {
            roomNumber : Number(roomNumber),
            userCode : user.userCode,
            auth : '참여자'                        
        }
        axios.post("/api/room/addChatMember", roomData )
                    .then(result => {
                        if(result === 0){
                            alert('입장실패');
                            return;
                        }else {
                            setSideBarStatus('room');
                            return roomData.roomNumber;
                        }
                    })
                    .then(response => nav('/room/' + response));
    }
 
    return (
        <Container>
            <MainArea className='backgCon'>
                <HeaderMainDiv style={data.backGroundImg !== null ? {backgroundImage : `url("http://192.168.0.140/uploadImg/userImg/${data.backGroundImg}")`} : {backgroundImage : 'url("http://192.168.0.140/uploadImg/backgroundsample.jpg")'}}>
                    <LeftSection>
                        <h2>{data.userNickName}님 환영합니다!!</h2>
                        <p>다양한 커뮤니티를 즐겨보세요!</p>
                        <p>아래는 추천과 인기 서버입니다.</p>
                    </LeftSection>
                    <RightSection>
                        <div onClick={handleClickAddFriend} >
                            <img src="//192.168.0.140/uploadImg/icon/friendAdd.png" alt="friendAdd" />
                            <h3>친구 찾아보기</h3>
                        </div>
                        <div onClick={handleClickCreateRoom}>
                            <img src="//192.168.0.140/uploadImg/icon/room.png" alt="roomCreate" />
                            <h3>방 만들기</h3>
                        </div>
                    </RightSection>
                </HeaderMainDiv>
                <BodyMainDiv id='bodyMainDiv'>
                    {latestRooms.length > 0 ? 
                    <>
                    <h3>최근 참가한 방</h3>
                    <LatestRoomSection>
                        {latestRooms.map((list,index) => (
                            <RoomBox key={list.index} data-list={list.roomNumber} style={{marginRight : '5%'}} onClick={handleClickGoRoom}>
                                <div>
                                    <BgImg style={{backgroundColor : 'white'}} src={'/' + list.roomBgImg} alt="" onError={(e) => {e.target.onerror = null; e.target.src = `http://192.168.0.140/uploadImg/userImg/backgroundImg${index + 1}.jpg`;}}/>
                                </div>
                                <CircleImg style={{backgroundColor : 'white'}} src={'/' + list.roomIcon} alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                                <span>#{list.roomCategory}</span>
                                <p><b>{list.roomTitle}</b><br/><br/>{shortText[index]}</p>
                            </RoomBox>
                        ))}
                    </LatestRoomSection>
                    </> : null
                    }
                    <h3>추천 방</h3>
                    <RecommendRoomSection>
                        {roomList.length > 0 ? roomList.map((list, index) => index < 6 ? (
                            <RoomBox key={list.index} style={{marginRight : '5%'}} data-list={list.roomNumber} onClick={handleClickGoRoom}>
                                <div>
                                    <BgImg style={{backgroundColor : 'white'}} src={'/' + list.roomBgImg} alt="" onError={(e) => {e.target.onerror = null; e.target.src = `http://192.168.0.140/uploadImg/userImg/backgroundImg${index + 1}.jpg`;}}/>
                                </div>
                                <CircleImg style={{backgroundColor : 'white'}} src={'/' + list.roomIcon} alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                                <span>#{list.roomCategory}</span>
                                <p><b>{list.roomTitle}</b><br/><br/>{shortText[index]}</p>
                            </RoomBox>
                        ) 
                        : null)
                    : null}
                    </RecommendRoomSection>
                </BodyMainDiv>
            </MainArea>
            <SideLeftCreateRoom1 data={data} create={creatRoom} create1={setCreateRoom} setRoomNum={setRoomNum} ws={ws} create3={creatRoom3} setCreate3={setCreateRoom3} setBackStatus={setBackStatus} />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    `;

const MainArea = styled.div`
        
    // background-color: rgba(30, 31, 34, 0.7);
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto;
`;

const HeaderMainDiv = styled.div`
    /* background-image: linear-gradient(90deg, rgba(223, 242, 255,1) 20.5625%,rgba(222, 241, 254,1) 20.5625%,rgba(34, 104, 153,1) 80.5625%); */
    /* background-image: url('http://192.168.0.140/uploadImg/userImg/2b9fc64e-bdd7-4e52-a752-1164140070a0_userBackgroundImg.jpg'); */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
`;

const LeftSection = styled.div`
    width: 60%;
    margin: 3%;
    h2{
        padding: 0px;
        margin: 0px;
        margin-bottom: 15px;
        font-size: 2rem;
    }
    p{
        margin: 0px;
        font-size: 1.05rem;
        font-weight: bold;
    }
`;

const RightSection = styled.div`
    width: 550px;
    div{
        width: 37%;
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        background-color: #2A313C;
        padding: 2%;
        margin: 5%;
        margin-left: 250px;
        border-radius: 20px;

        &:hover{
            cursor: pointer;
        }

        img{
            margin-left: 10px;
            margin-right: 10px;
            width: 40px;
            height: 40px;
        }
        h3{
            color: white;
            width: 200px;
            padding: 0px;
            margin: 0px;
            font-weight: 500;
        }
    }
`;

const CircleImg = styled.img`
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius : 50%;
        left: 5%;
        top: 27%;
        border: 5px solid black;
`;

const BgImg = styled.img`
    width: 100%;
    height: 100%;
`;

const BodyMainDiv = styled.div`
    width: 100%;
    height: 70%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    h3{
        color: white;
        margin: 3%;
        margin-left: 10%;
    }
`;

const LatestRoomSection = styled.div`
    display: flex;
    flex-wrap: wrap;  // div 요소들이 래핑되도록 함
    width: 100%;
    margin-left: 8%;
    margin-right: 10%;
`;

const RecommendRoomSection = styled.div`
    display: flex;
    flex-wrap: wrap;  // div 요소들이 래핑되도록 함
    width: 100%;
    margin-left: 8%;
    margin-right: 10%;
`;

const RoomBox = styled.div`
    width : 350px;  // 한 줄에 3개씩 배치
    height: 280px;
    margin-bottom: 5%;
    position: relative;
    background-color: black;
    border-radius: 20px;
    overflow: hidden;
    &:hover{
        cursor: pointer;
    }
    span{
        position: absolute;
        color: #CBC7C7;
        right: 5%;
        top: 53%;
    }
    div{
        height: 40%;
        width: 100%;
        background-size: cover;
        background-position: center;
    }
    p{
        margin-top: 39px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 15px;
        color: white;
    }
`;  


export default Main;