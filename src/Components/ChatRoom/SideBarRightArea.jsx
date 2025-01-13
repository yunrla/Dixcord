import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SideBar from '../Seoyeon/SideBar/SideBar';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SideLeftCreateRoom1 from './SideLeftCreateRoom1';
import Sidebarsearch from '../YDH/SidebarSearch/Sidebarsearch';
import NinoBot from '../shg/NinoBot';
import NinoBotConfig from '../shg/NinoBotConfig';
import SettingsRoom from './SettingsRoom';
import SideLeftCreateRoom3 from './SideLeftCreateRoom3';
import Confirm from '../Alert/Confirm';
import Alert from '../Alert/Alert';

const Container = styled.div`
    margin: 0 auto;
    width: 350px; 
    flex-direction: column; /* 상단-중앙-하단 구조 */
    box-sizing: border-box; /* 여백 계산 포함 */
    overflow: scroll;
    position: relative;
    color: ${({ theme }) => theme.textColor};
    font-size: 18px; 
    padding: 8px;
    
`

const Header = styled.div`
    margin: 5px;
    height: 30%;
    display: flex;
    flex-direction: column;
    padding: 18px;
    box-sizing: border-box;   
`
const Body = styled.div`
    position: fixed;
    right: 0%;
    width: 270px;
    top: 5%;
    height: 93%;
    box-sizing: border-box;
    background-color: rgba(30, 31, 34, 0.7); 
    margin: 10px;
    border-radius: 10px;
    overflow: auto; 
    color: white;
`
const ChatMemberList = styled.div`
    align-items: center; /* 수평 중앙 정렬 */
    margin-left: 10px;
    gap: 4px;
    border-radius: 10px;
    overflow: auto;

    h3{
        text-align: center;
    }
`
const Footer = styled.div`
    height: 10%; /* 전체 높이의 10% */
    padding: 5px;
    border-top: 1px solid black;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
`

const Separator = styled.div`
    border: 1px solid #d8d5d5;
    width: 100%;
    border-radius: 1px;
    margin: 10px 0;
    position: center;
   
`

const DownArrow = styled.div`
    width: 10px; /* 더 큰 너비 */
    height: 10px; /* 더 큰 높이 */
    border-top: 2px solid white; /* 더 두꺼운 위쪽 테두리 */
    border-right: 2px solid white; /* 더 두꺼운 오른쪽 테두리 */
    display: inline-block;
    transform: ${(props) => (props.active === true ? 'rotate(135deg)' : 'rotate(-45deg)')};
    position: relative;
    margin-bottom: ${(props) => (props.active === true ? '3px' : '-1px')};
    margin-left: 10px;
    
`

const DownArrow2 = styled(DownArrow)`
  margin: 0 5px;
`

const Img = styled.img`
width: 45px;
height: 45px;
object-fit: cover; 
border-radius: 50%;
`
const Ul = styled.ul`
padding:0 1.5px;
display: flex;
flex-direction: row;  
align-items: center; 
margin-top: 10px;
`

const Divlist = styled.div`
    margin-bottom:10px;
`;

const Circle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex; 
  cursor: pointer;
  position: relative;


  img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    border-radius: 50%;
    position: absolute;
   
  }
`

const Circle1 = styled(Circle)`
    background-color:#d6d4d4;
    background-image: url('//192.168.0.140/uploadImg/logo.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`

const Circle2 = styled.div`
    background-image: url('//192.168.0.140/uploadImg/icon/plus.png');
    cursor: pointer;
    background-size: cover;
    background-position: center;
    width: 28px;
    height: 24px;
    position: absolute;
    
    right: 0;
    top: 2px;
   
`
const RightModal = styled.div`
  justify-content: center;
  color: aliceblue;
  position: absolute;
  background-color: rgba(29, 29, 29, 0.9);
  box-sizing: border-box; 
  border-radius: 3%;
  border: 0.3px solid rgba(212, 201, 201, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
`

const HeaderSection = styled.div`
    position: relative;
    display: flex; 
    justify-content: flex-start;  
    align-items: center;
    margin: 0 5px;
`


const ChatListDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); 
    height: ${(props) => (props.active === true ? '50px' : 'auto')};
    max-height: 350px;
    overflow-y: scroll;
    gap: 10px;
    padding: 20px 2px;  
    transition:height 0.6s ease-in-out;
`

const SearchDiv = styled.div`
 margin: 30px;
 margin-top: 20px;
`;


const SearchInput = styled.input`
    background-color: rgba(0, 0, 0, 0.8); /* 어두운 배경색 */
    color: white; /* 글자 색을 흰색으로 */
    border: 1px solid #222222; /* 테두리 색 */
    padding: 10px; /* 내부 여백 */
    margin-left: -30px;
    font-size: 16px; /* 폰트 크기 */
    width: 260px; /* 너비 */
    height: 30px; /* 높이 */    
    position: relative;
    background-image: url('//192.168.0.140/uploadImg/icon/search.png'); /* 돋보기 아이콘 */
    background-size: 20px 20px; /* 아이콘 크기 */
    background-repeat: no-repeat;
    background-position: right 10px center; /* 아이콘을 오른쪽에 위치시킴 */
    &:focus {
        outline: none; /* 포커스 시 기본 테두리 없애기 */
    }
`;

const RightModalDiv = styled.div`
    box-sizing: border-box;
    margin: 10px;
    font-size: 13px;  /* 글자 크기 작게 */
    letter-spacing: -0.5px;  /* 자간을 줄임 */
    flex: 1;

    &:hover {
        color:#01CD9A;
        cursor: pointer;
    }
`

//shg 전용 div
//윤씨랑 협의해서 통일감 만들기
const BotProfileDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;
    border-radius: 5px;
    background-color: #23272a;
`;
const BotImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url('http://192.168.0.140/uploadImg/icon/NINO1223NOBG.png');
    
`;
const BotName = styled.span`
    color: #7289da;
    font-weight: bold;
`;

const NinoBotArea = styled.div`
    position: fixed;
    right : 9%;
    top : 13%;
    z-index : 9999;
`;

const OptionDiv = styled.div`
    display: flex;
    text-align: center;
    align-items: center; 
    width: 260px;
    height: 85px;
    background-color: rgba(42, 42, 42, 0.8);  
    border-radius: 0 10px 10px 0;
    margin-top: 10px;
 
    `
const OptionDiv1 = styled.div`
    height: 85px;
    width: 10px;
    border-radius: 3px;
    background-color: #01CD9A;

`

const OptionDiv2 = styled.div`
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    text-align: center;
    align-items: center; 
    

`

const OptionMenu = styled.div`
    padding-left: 40px;
    cursor: pointer;
        p{
            margin: 10px;

        }
`


const Span = styled.span`
        color: #aaa;
       font-size: 28px;
       font-weight: bold;
       cursor: pointer;
        transition: color 0.3s ease;
        position: absolute; /* 절대 위치로 설정 */
        top: 5px; /* 상단에서 10px */
        right: 10px;
    `

const InviteModal = styled.div`
  display: ${(props) => (props.inviteModal ? 'block' : 'none')};
  position: fixed;
  top: 300px;
  left: 181px;
  width: 270px;
  height: 160px;
  background: rgba(50, 50, 50, 1); 
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
`;



const Title = styled.h3`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 10px;
  color: #f4f1f1;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InviteCode = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #555;
  padding: 10px 50px;
  background: #f4f4f5;
  text-align: center;
`;

const CopyButton = styled.button`
  padding: 6px 11px;
  background: #03ad82;
  color: white;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const InviteCodeBtn = styled.button`
    background-color: #38393a;  /* 아이폰 기본 블루 색상 */
    color: white;                /* 텍스트 색상 */
    border: none;                /* 테두리 제거 */
    border-radius: 3px;         /* 둥근 모서리 */
    padding: 5px 10px;          /* 적당한 여백 */
    cursor: pointer;             /* 마우스 커서를 포인터로 설정 */
    font-size: 12px;             /* 텍스트 크기 */
    text-align: center;          /* 텍스트 중앙 정렬 */
    transition: background-color 0.3s ease, transform 0.2s ease; /* 배경색과 크기 애니메이션 */
    display: inline-block;
    margin-left: 102px;
    
    &:hover {
        background-color: #68706d;  /* 마우스를 올렸을 때 배경색 */
        transform: translateY(-2px); /* 살짝 위로 올라가는 효과 */
    }

`;

const MemberSeparator = styled.div`
  height: 1px;
  background-color: #ddd; /* 구분선 색상 */
  width: 10px; /* 구분선 길이를 50%로 설정 */
`;



const MemberSeparatorWrapper = styled.div`

  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px; /* 텍스트와 구분선 사이 간격 */
  margin-top: 30px;
`;

const Span2 = styled.span`
    margin: 0;
`

const Span3 = styled.span`
    margin-left: 1px;
    font-size: 14px;
    padding: 0 3px;
`

function SideBarRightArea({ setMusicPlay, setWarnNkick, setRoomNumber, data, sideStatus, roomNumber, rightSide, setRoomNum, setCurrentVideo, banWordList , setBanWordList, setChatbanstatus, ws, reloadState, setReloadState, refreshFriend, setRefreshFriend }) {

    const nav = useNavigate();
    const [memberInfo, setMemberInfo] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [creatRoom, setCreateRoom] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [modalStyle, setModalStyle] = useState({ display: ' none' });
    const [searchStatus, setSearchStatus] = useState(false);
    const [arrowStatus, setArrowStatus] = useState(true);
    const [settingRoom, setSettingRoom] = useState(false);
    const [inviteCode, setInviteCode] = useState(0);
    const [inviteModal, setInviteModal] = useState(false);
    const [creatRoom3, setCreateRoom3] = useState(false);
    //3번 모달(초대코드 입력)뒤로가기 버튼 상태값
    const [backStatus, setBackStatus] = useState(false);
    //방장 여부에 따라 우클릭 메뉴 다르게
    const [auth, setAuth] = useState('');
    //방장 유저코드를 사용해 멤버리스트 구분
    const [authCode, setAuthCode] = useState('');
    //참여자 수 저장
    const [memberLength, setMemberLength] = useState('');
    // 컨펌 및 알람 모달 창
    const [isCloseCon, setIsCloseCon] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [message, setMessage] = useState('');

    //shg
    const [isBotModalOpen, setIsBotModalOpen] = useState(false);
    const [currentBotModal, setCurrentBotModal] = useState("NinoBot");
    const location = useLocation();

    const getChatList = async () => {
        const response = await axios.get(`/api/room/getChatList/${data.userCode}`);
        const result = await response.data;

        if(result.length > 0){

            setChatList(result.filter(room => room.roomNumber < 9999));

        }
    };


    useEffect(() => {
        if (data !== null) {
            getChatList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data !== null) {
            getChatList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomNumber]);

    //멤버목록 리로드
    useEffect(() => {

        if (reloadState) {
            getMemberList();
        }

    }, [reloadState]);

    const getMemberList = async () => {

        if (roomNumber) {

            try {

                const response = await (axios.get(`/api/room/getChatMember/${roomNumber}`));
                const members = response.data;

                //방장 유저코드 저장
                setAuthCode(members[0].userCode);
                //참여자 수 저장
                setMemberLength(members.length - 1);



                //상태 초기화
                setMemberInfo([]);

                for (let i = 0; i < members.length; i++) {
                    const member = members[i];

                    const response2 = await (axios.get(`/api/room/getMemberInfo/${member.userCode}`));
                    const memberInfo = response2.data;

                    setMemberInfo((prev) => [...prev, memberInfo]);
                    setReloadState(false);

                }


            } catch (error) {
                setMessage('채팅 참여 멤버를 불러오지 못했습니다');
                setIsClose(true);
            }
        }


    };



    useEffect(() => {

        getMemberList();

    }, [roomNumber]);


    const handleOnclickRoom = (e) => {
        rightSide('room');
        setRoomNumber(Number(e.target.getAttribute('num')));
        setRoomNum(Number(e.target.getAttribute('num')));
        // roomStatus('chatRoom');

        nav('/room/' + e.target.getAttribute('num'));
    };

    const handleCreateRoom = () => {
        setCreateRoom(true);
    };

    const handleRightClick = async (e) => {

        e.preventDefault();

        const modalPosition = {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            display: 'block',
        }

        setActiveRoom(e.target.getAttribute('num'));
        setModalStyle(modalPosition);

    };
    

    const handleAuth = () => {
        axios.get(`/api/room/getRoomAuth/${data.userCode}/${activeRoom}`)
            .then(response => {
                setAuth(response.data);
            });

    }

    useEffect(() => {
        if (activeRoom != null) {

            handleAuth();
        }

    }, [activeRoom]);

    const handleClickOutSide = (e) => {
        const modal = document.getElementById('rightModal');
        if (modal && !modal.contains(e.target)) {
            setModalStyle({ display: 'none' });
            setActiveRoom(null);

        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutSide);

        return () => {
            window.removeEventListener('click', handleClickOutSide);
        }
    }, []);

    //shg 코드 추가
    useEffect(() => {
        setIsBotModalOpen(false);        
        setCurrentVideo('');
      }, [location]);   

    const handleSearch = () => {
        setSearchStatus(true);
    }


    const toggleArrow = () => {
      setArrowStatus((prev) => (!prev));
    }

    const handleDisplaySettings = () => {
        nav('/option/display');
    }

    const handleRoomExitHost = () => {

        axios.get(`/api/room/updateHost/${activeRoom}`)
        .then(response => {
            if (response.data > 0) {
                window.location.reload(true);
                // console.log("host 업데이트 성공");
            }else{
                // console.log("host 업데이트 실패");
            }
        })
         
    }


    const handleRoomExit = () => {
        const formData = {
            roomNumber: activeRoom,
            userCode: data.userCode,
        }

        axios.post('/api/room/exitRoom/', formData)

            .then(response => {
                if (response.data > 0) {

                    //웹소켓
                    const formattedMessage = JSON.stringify({
                        action: "exitRoom",
                        userCode: data.userCode,
                        roomNumber: Number(activeRoom),
                        userNickName: data.userNickName,
                    });
                    ws.send(formattedMessage);

                    getChatList();
                    getMemberList();
                    setModalStyle({ display: 'none' });
                    window.location.reload(true);
                } else {
                    setMessage('방 나가기를 실패하였습니다');
                    setIsClose(true);
                }
            })
    };

    const handleSettingRoom = () => {
        setSettingRoom(true);
        setModalStyle({ display: 'none' })
    }


    const copyInviteCode = () => {
        setInviteModal(true);

        axios.get(`/api/room/getInviteCode/${activeRoom}`)
            .then(response => {
                setInviteCode(response.data);
            })


    }


    const handleModalClose = () => {
        setInviteModal(false);
    }

    const copyText = () => {
        navigator.clipboard.writeText(inviteCode).then(function () {
            setMessage('초대코드가 복사되었습니다.');
            setIsClose(true);
            setInviteModal(false);
        }).catch(function (err) {
            setMessage('초대코드가 복사실패');
            setIsClose(true);
        });
    }

    const handleInviteCodeBtn = () => {
        setCreateRoom3(true);
        setBackStatus(false);
    }

    const handleOnConfirm = () => {
        setMessage('정말 방을 나가겠습니까?');
        setIsCloseCon(true);
    }

    const handleOnClose = () => {
        setIsClose(false);
    }

    const handleOnCloseCon = () => {
        setIsCloseCon(false);
    }


   


    return (
        
        <div style={{ height: '100%' }}>

            {sideStatus === 'room' ?
                <Container>
                <NinoBotArea  style={isBotModalOpen ? {display : 'block'} : {display : 'none'}}>
                         {currentBotModal === "NinoBot" ?
                            <NinoBot setCurrentVideo={setCurrentVideo} setCurrentBotModal={setCurrentBotModal}/> :
                            <NinoBotConfig  isBotModalOpen={isBotModalOpen} data={data} setMusicPlay={setMusicPlay} setWarnNkick={setWarnNkick} setCurrentBotModal={setCurrentBotModal} roomNumber={roomNumber} banWordList={banWordList} setBanWordList={setBanWordList} setChatbanstatus={setChatbanstatus} />
                         }
                    </NinoBotArea>
                <Header>
                    <SearchDiv>
                        <Sidebarsearch searchStatus={searchStatus} setSearchStatus={setSearchStatus} />
                        <SearchInput onClick={handleSearch} type="text" placeholder='검색하기' />
                    </SearchDiv>
                    <div>
                        <HeaderSection>방 <span><DownArrow onClick={toggleArrow} active={arrowStatus}></DownArrow></span><InviteCodeBtn onClick={handleInviteCodeBtn}>초대코드 입력</InviteCodeBtn><Circle2 onClick={handleCreateRoom} /></HeaderSection>
                        <Separator></Separator>
                        <ChatListDiv active={arrowStatus}>
                            {chatList.length > 0 ? chatList.map((list, index) => (
                                <Divlist style={{position : 'relative'}} num={list.roomNumber} key={index} className='roomList'>
                                    <Circle num={list.roomNumber} onClick={handleOnclickRoom}>
                                        <img
                                            src={`/${list.roomIcon !== null ? list.roomIcon : 'logo192.png'}`}
                                            alt={`${list.roomNumber}`}
                                            num={list.roomNumber}
                                            onClick={handleOnclickRoom}
                                            onContextMenu={handleRightClick}
                                        />
                                    </Circle>
                                </Divlist>
                            )) : null}
                        </ChatListDiv>
                    </div>

                    {/*<Separator style={{marginTop:'20px'}}></Separator> */}
                    {/* <div>이벤트</div> */}

                    <div>
                        <section style={{ marginTop: '30px' }}>채팅 채널</section>
                        <Separator></Separator>
                        <section> # 채팅 채널 이름</section>
                    </div>
                    <div >
                        <section style={{ marginTop: '20px' }}>음성 채널</section>
                        <Separator></Separator>
                        <section> # 음성 채널 이름</section>
                    </div>
                </Header>
                {sideStatus === 'room' && roomNumber !== 0 ? (
                    <Body className='backgCon'>

                            <BotProfileDiv onClick={() => setIsBotModalOpen(!isBotModalOpen)}>                                    
                                <BotImg src="http:\\192.168.0.140\uploadImg/ninopla.jpg" alt='NinoBot'/>
                                <BotName>NINOBOT</BotName>
                            </BotProfileDiv>
                        <ChatMemberList>
                            <MemberSeparatorWrapper>
                                <Span2>방장</Span2>
                                <MemberSeparator /> 👑
                            </MemberSeparatorWrapper>
                            {memberInfo
                                .filter((info) => info.userCode === authCode)
                                .map((info) => (
                                    <Ul key={info.userCode}>
                                        <Img src={`http://192.168.0.140/uploadImg/userImg/${info.userIcon}`} alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                                        <Span3 style={{ marginLeft: '4px' }}>{info.userNickName}</Span3>
                                    </Ul>
                                ))}
                            <MemberSeparatorWrapper>
                                <Span2>참여자</Span2>
                                <MemberSeparator />
                                {memberLength}
                            </MemberSeparatorWrapper>
                            {memberInfo
                                .filter((info) => info.userCode !== authCode)
                                .map((info) => (
                                    <Ul key={info.userCode}>
                                        <Img src={`http://192.168.0.140/uploadImg/userImg/${info.userIcon}`} alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                                        <Span3 style={{ marginLeft: '4px' }}>{info.userNickName}</Span3>
                                    </Ul>
                                ))}
                        </ChatMemberList>

                    </Body>
                ) : (
                    <p></p>
                )}
            </Container>

                : sideStatus === 'friend' ? 
                <Container>
                    <Header>
                        <div>
                            <h2 style={{marginTop : '5px'}}>친구목록</h2>
                        </div>
                        <SideBar user={data} refreshFriend={refreshFriend} setRefreshFriend={setRefreshFriend}/>
                    </Header>
                </Container>
            : 
            sideStatus === 'option' ?
            <Container>
                <Header style={{ marginBottom: '0' }}>
                    <OptionDiv>
                        <OptionDiv1></OptionDiv1>
                        <OptionDiv2>
                            <img src="http://192.168.0.140/uploadImg/icon/option.png" alt="" width={'40px'} height={'40px'} style={{ marginRight: '15px' }} />
                            <h2>앱 설정</h2>
                        </OptionDiv2>
                    </OptionDiv>
                </Header>
                <Body>
                    <OptionMenu style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={handleDisplaySettings}>
                        <p>디스플레이</p>
                    </OptionMenu>
                    <OptionMenu style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p>음성 및 비디오</p>
                    </OptionMenu>
                    <OptionMenu style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p>채팅</p>
                    </OptionMenu>
                    <OptionMenu style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p>기타</p>
                    </OptionMenu>
                </Body>
            </Container>
            :
            sideStatus === 'service' ? 
            <Container>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('/service')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>메인화면</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('/service/notice')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>공지사항</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('/service/qna')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>자주 묻는 질문</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('/mypage/myquestions/' + data.userCode)}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>내 문의</h2>
                </ButtonBu>
            </Container>
            : sideStatus === 'admin' ? 
            <Container>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('adminUser')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>유저관리</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('adminService')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>문의관리</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('/service/notice')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>공지사항</h2>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('adminOption')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h2>채팅방 관리</h2>
                </ButtonBu>
            </Container>
            : sideStatus === 'myPage' ? 
            <Container>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('myPage')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>내 정보</h1>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}} onClick={() => nav('myInq')}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>내 문의</h1>
                </ButtonBu>
            </Container>
            :
            <Container>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>메인화면</h1>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>공지사항</h1>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>자주 묻는 질문</h1>
                </ButtonBu>
                <ButtonBu style={{margin : '20px', display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <img src="http://192.168.0.140/uploadImg/icon/option.png" alt=""  width={'45px'} height={'45px'} style={{marginRight : '20px'}}/>
                    <h1>내 문의</h1>
                </ButtonBu>
            </Container>
            }
            <SideLeftCreateRoom1 data={data} create={creatRoom} create1={setCreateRoom} setRoomNum={setRoomNum} ws={ws} create3={creatRoom3} setCreate3={setCreateRoom3} setBackStatus={setBackStatus} />
            <SideLeftCreateRoom3 create1={setCreateRoom} create3={creatRoom3} setCreate3={setCreateRoom3} data={data} setRoomNum={setRoomNum} ws={ws} backStatus={backStatus} setbackStatus={setBackStatus} />
            {auth === '방장' ?
                <RightModal id="rightModal" style={{ ...modalStyle }} >
                    <RightModalDiv onClick={handleSettingRoom}>방 설정 변경하기</RightModalDiv>
                    <RightModalDiv onClick={copyInviteCode}>초대코드 복사</RightModalDiv>
                    <RightModalDiv onClick={handleRoomExitHost}>방 삭제하기</RightModalDiv>
                    {/* <RightModalDiv onClick={handleDropRoom}>방 삭제하기</RightModalDiv>
                    <RightModalDiv onClick={handleRoomExitHost} >방 나가기</RightModalDiv> */}
                </RightModal>
                :
                <RightModal id="rightModal" style={{ ...modalStyle }} >
                    <RightModalDiv onClick={copyInviteCode}>초대코드 복사</RightModalDiv>
                    <RightModalDiv onClick={handleOnConfirm}>방 나가기</RightModalDiv>
                </RightModal>
            }


            {/* 방 설정 컴포넌트 */}
            <SettingsRoom data={data} settingRoom={settingRoom} setSettingRoom={setSettingRoom} activeRoom={activeRoom} setActiveRoom={setActiveRoom} />


            {/* 초대코드 모달 */}
            <InviteModal style={{ display: inviteModal ? 'block' : 'none' }}>
                <Span onClick={handleModalClose}>&times;</Span>
                <Title>초대코드</Title>
                <ContentWrapper>
                    <InviteCode>{inviteCode}</InviteCode>
                    <CopyButton onClick={copyText}>복사</CopyButton>
                </ContentWrapper>
                <span style={inviteModal ? {display : 'none', color : '#1269db'} : {display : 'block', color : '#1269db'}}>초대코드가 복사되었습니다.</span>
            </InviteModal>

            {isClose && <Alert message={message} onClose={handleOnClose}/>}
            {isCloseCon && <Confirm message={message} onConfirm={handleRoomExit} onCancel={handleOnCloseCon}/>}
        </div>
          

       
    );
    
}

const ButtonBu = styled.div`
    cursor: pointer;
`;



export default SideBarRightArea;