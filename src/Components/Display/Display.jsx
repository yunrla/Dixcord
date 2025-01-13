import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Login from '../DongWoo/User/Login';
import MainHome from '../Layout/MainHome';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import Main from '../Layout/Main';
import Logout from '../DongWoo/User/Logout';
import Register from '../DongWoo/User/Register';
import axios from 'axios';
import SideBarLeftArea from '../ChatRoom/SideBarLeftArea';
import SideBarRightArea from '../ChatRoom/SideBarRightArea';
import ChatRoom from '../ChatRoom/ChatRoom';
import Friend from '../Seoyeon/Friend/Friend';
import CustomerService from '../YDH/CustomerService/CustomerService';
import NoticeMain from '../YDH/CustomerService/Composition/Notice/NoticeMain';
import QnAMain from '../YDH/CustomerService/Composition/QnA/QnAMain';
import MyQuestionMain from '../YDH/CustomerService/Composition/MyQuestion/MyQuestionMain';
import NoticeDetail from '../YDH/CustomerService/Composition/Notice/NoticeDetail';
import NoticeModify from '../YDH/CustomerService/Composition/Notice/NoticeModify';
import NoticeWrite from '../YDH/CustomerService/Composition/Notice/NoticeWrite';
import ServiceSearchPage from '../YDH/CustomerService/ServiceSearchPage';
import GoogleAuthRedirect from '../DongWoo/User/GoogleAuthRedirect';
import KakaoAuthRedirect from '../DongWoo/User/KakaoAuthRedirect';
import Sidebar from '../Layout/Sidebar';
import FindUserData from '../DongWoo/User/FindUserData';
import MyPage from '../DongWoo/MyPage/MyPage';
import FriendChat from '../Seoyeon/ChatFriendRoom/FriendChat';
import MyQuestionList from '../YDH/CustomerService/Composition/MyQuestion/MyQuestionList';
import ModalAlarm from '../DongWoo/Alarm/ModalAlarm';
import AdminMain from '../DongWoo/Admin/AdminMain';
import AdminUser from '../DongWoo/Admin/AdminUser';
import AdminService from '../DongWoo/Admin/AdminService';
import AdminOption from '../DongWoo/Admin/AdminOption';
import DisplayOption from '../ChatRoom/DisplayOption';
import MyInq from '../DongWoo/MyPage/MyInq';
import VideoCall from '../Hoyeon/VideoCall';

const NotLogin = styled.div`
    height: 100vh;
    width: 100%;
    &::-webkit-scrollbar {
        display: none;
    }
    div::-webkit-scrollbar{
        display: none;
    }
    overflow-y: auto;
`;

const Warrper = styled.div`
    background-image: url('/images/backgroundImg/4882066.jpg');
    background-size: cover;
    height: auto;
    min-height: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
    overflow-y: hidden;
    background-image: url('/images/backgroundImg.jpg');
    /* background-image: url('//192.168.0.140/uploadImg/viewImg.jpg'); */
    /* background-image: url('http://192.168.0.140/uploadImg/userImg/6bcc60e6-b088-4b3b-9e97-b9c94201639e_backgroundImgsample.jpg'); */
    /* background-image: linear-gradient(108.47038220091133deg, rgba(43, 240, 191,1) 30.898437499999996%,rgba(43, 240, 191,1) 34.371744791666664%,rgba(14, 227, 206,1) 56.68511284722222%,rgba(24, 198, 214,1) 81.41927083333333%);; */
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    &::-webkit-scrollbar {
        display: none;
    }
    div::-webkit-scrollbar{
        display: none;
    }
    .loginBtn{
        background-image: linear-gradient(108.47038220091133deg, rgba(43, 240, 191,1) 30.898437499999996%,rgba(43, 240, 191,1) 34.371744791666664%,rgba(14, 227, 206,1) 56.68511284722222%,rgba(24, 198, 214,1) 81.41927083333333%);
    }

    .backgCon {
        background-color: ${({ theme }) => theme.bgColor};
        color: ${({ theme }) => theme.textColor};
    }

    .textCol {
        color: ${({ theme }) => theme.textColor};
    }
`;

const HeaderArea = styled.div`
    height: 4%; /* 헤더 영역 */
    box-sizing: border-box;
    border-radius: 15px;
    margin: 10px;
    margin-bottom: 0px;
    background-color: ${({ theme }) => theme.bgColor}; /* theme에 맞는 배경색 설정 */
    padding: 15px 0px; /* padding 설정 */
`;

const BodyArea = styled.div`
    display: flex; /* 가로로 나열 */
    flex-direction: row;
    height: 95%; /* BodyArea의 높이를 전체의 90%로 설정 */
    width: 100%;
    box-sizing: border-box;
    align-items: stretch;
`;
const SideBarDiv = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`;

const MainContentDiv = styled.div`
    display: flex;
    height: 100%;
    width: 100%;

`;

function Display({ theme, getTheme }) {

    const [getUser, setUser] = useState(null);

    const [loginStatus, setLoginStatus] = useState(false);

    const [sideBarStatus, setSideBarStatus] = useState('friend');

    const [banWordList, setBanWordList] = useState([]);

    const [roomNumber, setRoomNumber] = useState(0);
    
    const [chatbanstatus, setChatbanstatus] =useState(true);

    const [currentVideo, setCurrentVideo] = useState(null);

    const [latestRoom, setLatestRoom] = useState([]);

    const [refreshFriend, setRefreshFriend] = useState({
        userCode : 0,
        refresh : false
    });

    const [reloadState, setReloadState] = useState(false);

    const [ws, setWs] = useState(null);

    const [warnNkick, setWarnNkick] = useState(true);

    const [musicPlay, setMusicPlay] = useState(true);

    const nav = useNavigate();

    const loginUser = async () => {
        await axios.get('/test/api/user')
            .then(response => {
                if(response.data.principal.member === undefined){
                    setUser(null);
                    return;
                }
                setUser(response.data.principal.member);
                openSocket(response.data.principal.member);
                nav('/');
            });
        }

    // 웹소켓 연결 함수
    const openSocket = (user) => {

        if (ws && ws.readyState === WebSocket.OPEN) {
          return; // 이미 연결되어 있다면 추가 연결을 방지
        }
        // 192.168.0.140
        let socket = new WebSocket(`ws://localhost:9090/chat?userCode=${user.userCode}&textChatNo=0`);
    
        socket.onopen = () => {};
        socket.onerror = (error) => {
            // console.error('WebSocket Error:', error);
        };
    
        socket.onclose = () => {
          setWs(null); // 상태 초기화
        };
    
        // 메시지 수신 이벤트
        socket.onmessage = (msg) => {
    
          try {
            const data = JSON.parse(msg.data);
            const newMessage = {
              action : data.action,
              userCode: data.userCode,
              userNickName: data.userNickName,
              content: data.message,
              date: data.date,
              userIcon: data.userIcon,
              chatguid: data.chatguid,
              editText: data.editText,
            };

            if(newMessage.action === 'USERSTATE_UPDATE'){
                setRefreshFriend({
                    userCode : newMessage.userCode,
                    refresh : true
                })
            }else if(!newMessage.action && newMessage.userCode){
                // 채팅 보내면 sideBar 레드닷
                setRefreshFriend(prev=> ({
                    ...prev,
                    userCode: newMessage.userCode,
                    refresh: false,
                    alertStatus: {
                        ...prev.alertStatus,
                        [newMessage.userCode]: true,
                    }
                }));
            }

          } catch (err) {
            // console.error('Invalid JSON received', err);
          }
        };
    
        setWs(socket);
      };
        
        
        // 채팅 봇 ( 금지어 리스트 가져오기 )
        useEffect(() => {
            if(getUser !== null){
                //roomnumber나중에 usestate로 가져와
                const fetchBanWords = async () => {
                    const resp = await axios.get('/api/bot/banWordList?roomnumber=1');          
                    setBanWordList(resp.data);
                }
                fetchBanWords();
            }
    }, [roomNumber, getUser]);
        
    useEffect(() => {
        loginUser();
    }, [loginStatus]);
    useEffect( () => {
        if(getUser !== null){
            axios.get('/user/api/loginState?userCode=' + getUser.userCode)
            .then((response) => {
                    if(getUser.userState === '오프라인'){
                        setUser(prev => ({
                            ...prev,
                            userState : '온라인'
                        }));
                    }
                    if(ws !== null && ws.readyState === WebSocket.OPEN){
                        const timestamp = Date.now();
                        const formattedMessage = JSON.stringify({
                            action: "userLogin",
                            userCode: getUser.userCode,
                            textChatNo : Number(0),
                            userNickName: 'hihi',
                            message: 'tete',
                            date: timestamp,
                            userIcon: 'asd',
                        });
                        ws.send(formattedMessage);
                    }
                });
        }
    }, [getUser]);

    useEffect(() => {
        if (roomNumber !== 0) {
            setLatestRoom((prev) => {
                // 중복 제거 후 최근 값 추가
                const updatedRooms = [roomNumber, ...prev.filter((num) => num !== roomNumber)];
                
                // 최대 길이가 6을 초과하면 마지막 요소를 제거
                if (updatedRooms.length > 6) {
                    updatedRooms.pop(); // 배열의 마지막 요소 제거
                }
                
                return updatedRooms;
            });
        }
    }, [roomNumber]);

    return (
        <>
            { getUser === null ? 
            <NotLogin>
                <Warrper>
                <HeaderArea style={{backgroundColor : 'transparent', margin:0}}>
                    <Header data={getUser} theme={theme} setSideBarStatus={setSideBarStatus}/>
                </HeaderArea>
                <div style={{height : '100%'}}>
                    <Routes>
                        <Route path='/' element={<MainHome/>}/>
                        <Route path='/login' element={<Login data={setUser} status={setLoginStatus}/>}/>
                        <Route path='/findPw' element={<FindUserData/>}/>
                        <Route path='/kakaoLogin' element={<KakaoAuthRedirect/>}/>
                        <Route path='/googleLogin' element={<GoogleAuthRedirect getUser={getUser} setLoginStatus={setLoginStatus}/>}/>
                        <Route path='/register' element={<Register/>}/>
                        <Route path='/service' element={<CustomerService getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                        <Route path='/service/qna' element={<QnAMain getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                        <Route path='/service/notice' element={<NoticeMain getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                        <Route path='/service/notice/:idx' element={<NoticeDetail getUser={getUser}/>}/>
                        <Route path='/service/search' element={<ServiceSearchPage getUser={getUser}/>}/>
                    </Routes>
                </div>
                </Warrper>
            </NotLogin>
            : 
            <Container>
                {/* <ModalAlarm/> */}
                <HeaderArea>
                    <Header data={getUser} theme={theme} getTheme={getTheme} setSideBarStatus={setSideBarStatus}/>
                </HeaderArea>
                <BodyArea>
                    <SideBarDiv>
                        <Sidebar theme={theme}
                        setCurrentVideo={setCurrentVideo} 
                        setChatbanstatus={setChatbanstatus} 
                        banWordList={banWordList} 
                        setBanWordList={setBanWordList} 
                        setRoomNumber={setRoomNumber} 
                        getUser={getUser} 
                        setSideBarStatus={setSideBarStatus} 
                        sideBarStatus={sideBarStatus}
                        ws={ws} 
                        reloadState={reloadState} 
                        setReloadState={setReloadState}
                        refreshFriend={refreshFriend} 
                        setRefreshFriend={setRefreshFriend}
                        setMusicPlay={setMusicPlay} 
                        setWarnNkick ={setWarnNkick} />
                    </SideBarDiv>
                    <MainContentDiv>
                        <Routes>
                            <Route path='/' element={<Main data={getUser} latestRoom={latestRoom} setSideBarStatus={setSideBarStatus} ws={ws} setRoomNum={setRoomNumber}/>}/>
                            <Route path='/myPage' element={<MyPage getUser={getUser} setUser={setUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path='/myInq' element={<MyInq getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path="/friend" element={<Friend userData={getUser} setUser={setUser} refreshFriend={refreshFriend} setRefreshFriend={setRefreshFriend}/>} />
                            <Route path="/friendChat/:textChatNo" element={<FriendChat user={getUser} setUser={setUser}/>} />
                            <Route path='/room/:pId' element={<ChatRoom warnNkick={warnNkick} musicPlay={musicPlay} setReloadState={setReloadState} roomNumber={roomNumber} user={getUser} chatbanstatus={chatbanstatus} banWordList = {banWordList} setBanWordList={setBanWordList} currentVideo={currentVideo}/>}/>
                            <Route path='/logout' element={<Logout status={setLoginStatus} getUser={getUser} ws={ws}/>}/>
                            <Route path='/service' element={<CustomerService getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path='/service/qna' element={<QnAMain getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path='/service/notice' element={<NoticeMain getUser={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path='/service/notice/:idx' element={<NoticeDetail getUser={getUser}/>}/>
                            <Route path='/service/myquestion' element={<MyQuestionMain data={getUser} setSideBarStatus={setSideBarStatus}/>}/>
                            <Route path='/service/notice/write' element={<NoticeWrite data={getUser}/>}/> {/* 관리자 전용 */}
                            <Route path='/service/notice/modify/:idx' element={<NoticeModify/>}/>
                            <Route path='/service/search' element={<ServiceSearchPage/>}/>
                            <Route path='/mypage/myquestions/:userCode' element={<MyQuestionList data={getUser}/>}/>
                            <Route path='/googleLogin' element={<GoogleAuthRedirect/>}/>
                            <Route path='/Option/display' element={<DisplayOption/>}/>
                            <Route path='/adminMain' element={<AdminMain/>}/>
                            <Route path='/adminUser' element={<AdminUser/>}/>
                            <Route path='/adminService' element={<AdminService getUser={getUser}/>}/>
                            <Route path='/adminOption' element={<AdminOption/>}/>
                        </Routes>
                    </MainContentDiv>
                </BodyArea>
            </Container>
            }
        </>
    );
}

export default Display;