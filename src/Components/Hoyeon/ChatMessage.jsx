import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BsThreeDots } from 'react-icons/bs'; // 부트스트랩 아이콘 사용
import { FaTrashAlt, FaEdit, FaTrash } from 'react-icons/fa'; // 삭제와 수정 아이콘
import EmojiPicker from './EmojiPicker';
import GifModal from './GifModal';
import VideoCall from './VideoCall';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; // Full screen height
  width: 100%;
  position: relative;
  /* background-color: #36393f; */
`;

const BodyArea = styled.div`
  overflow-y: auto; // Scrollable content area
  min-height: 88%;
  max-height: 88%;
`;

const ArrowIcon = styled.div`
    position: relative;
    display: inline-block;
    width: 22px; /* 화살표 선 길이 */
    height: 1px; /* 화살표 선 두께 */
    background-color: #34c759; /* 화살표 색상 */
    &::after{
      content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 0 4px 8px; /* 삼각형 크기 */
    border-color: transparent transparent transparent #34c759; /* 삼각형 색상 */
    }
    margin-right: 10px;
`;

const WelcomArea = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 8px;
    /* background-color: #2f3136; */
    transition: background-color 0.2s;
    flex-direction: row;
    align-items: center;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  strong {
    color: #fff;
    margin-right: 3px;
  }

  span {
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    color: #b9bbbe;
    margin-left: 5px;
  }
`;

const FooterArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding-top: 10px; */
  width: 100%; // Reduced width for padding on sides
  z-index: 10;
  height: 10%;
  min-height: 10%;
  position: absolute;
  bottom: 0%;
  background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
  border-radius: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(30, 31, 34, 0.7);
  backdrop-filter: blur(10px); /* 배경 흐림 효과 추가 */
  border-radius: 20px;
  padding: 5px 10px;
  width: 100%; /* 채팅방 너비에 맞춤 */
  max-width: 1200px; /* 최대 너비 제한 */
`;

const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  color: #fff; /* 텍스트 색상 */
  padding: 8px;
  font-size: 21px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6); /* 플레이스홀더 색상 */
  }

  &:focus {
    outline: none;
  }
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  margin: 0 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;

  i {
      font-size: 23px;
    color: #b9bbbe;
  }

  &:hover i {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const RoundButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.1); /* 투명한 배경 */
  border-radius: 50%; /* 동그라미 모양 */
  width: 40px;
  height: 40px;

  i {
    font-size: 20px; /* 아이콘 크기 조정 */
  }
`;
const ChatArea = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 8px;
    /* background-color: #2f3136; */
    transition: background-color 0.2s;
    flex-direction: column;

  &:hover {
    background-color: #3a3d41; // Slightly darker on hover
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  strong {
    color: #fff;
    margin-right: 3px;
    font-size: 20px;
  }

  span {
    font-size: 20px;
    color: #fff;
    margin-left: 5px;
    font-weight: 100;
  }
`;

const DateDiv = styled.div`
  text-align: center;
  margin: 15px 0;
  color: #989da3; 
  font-size: 15px;

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 10px 0;
  }
`;
const ChatDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 10px; 
  ${({ isOwnMessage }) => isOwnMessage && `
    flex-direction: row-reverse;
  `}
  `;
const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 5px; /* 텍스트 내부 여백 추가 */
  max-width: 80%; /* 메시지 너비 제한 */
  margin-top: -6px;

  @media (max-width: 768px) {
    max-width: 95%; /* 작은 화면에서 너비를 확장 */
    margin-left: 10px;
  }
`;

const ChatSectionHeader = styled.div`
  display: flex;
  align-items: center; /* 닉네임과 날짜를 한 줄로 정렬 */
  margin-bottom: 2px;
   ${({ isOwnMessage }) => isOwnMessage && `
    flex-direction: row-reverse;
  `}

  strong {
    color: #fff;
    font-weight: bold;
    margin-right: 5px; /* 닉네임과 날짜 간 간격 */
  }
  span {
    font-size: 15px;
    color: #fff; 
        ${({ isOwnMessage }) => isOwnMessage && `
    margin-right: 10px;
  `}
  }
`;
const ChatSectionOne = styled.div`
  margin-top: 5px; /* 닉네임과 메시지 간 거리 */
  color: #d3d6da;
  word-wrap: break-word; /* 긴 단어 줄바꿈 처리 */
  word-break: break-word;
  color: #d3d6da;
  span{
    ${({ isOwnMessage }) => isOwnMessage && `
      font-size: 20px;
      color: #fff;
        display: block; /* 블록 요소로 변환 */
      text-align: right; /* 텍스트 오른쪽 정렬 */
      margin-right: 10px; /* 오른쪽 여백 추가 (필요에 따라 조정) */
      font-weight: 100;
      
    `}
  }
`;

const ChatSectionTwo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderArea = styled.div`
  color : white;
  margin-bottom: 10px;
  text-align: center;
  h2, h1, div {
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  }

  div {
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
      /* font-size: 15px; */
  }
`;

const RoomCreaterArea = styled.div`
  background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
  height: 15%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ChattingArea = styled.div`
  background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
  min-height: 61%;
  border-radius: 10px;
`;

//shg 전용 폰트
const BotDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 10px; 
`;
const IconWrapper = styled.div`
  width: 40px;
  height: 20px;
  background-color: #5C6BC0; /* 파란색 배경 */
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px; /* 네모에 약간 둥근 테두리 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 입체감 그림자 */
  margin-left: 8px;
`;
const IconText = styled.div`
  color: white;  
  font-size: 12px;
  font-weight: bold;
`;
const BotChatSectionOne = styled.div`
  margin-top: 5px; /* 닉네임과 메시지 간 거리 */
  color:rgb(162, 163, 167);
  word-wrap: break-word; /* 긴 단어 줄바꿈 처리 */
  word-break: break-word;
  font-style: oblique;
`;

const Modal = styled.div`
  position: fixed;
  transform: translate(8, -50%);
  background: #2F3136;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 180px;

  & > button {
    all: unset;
    cursor: pointer;
    padding: 8px 1px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 4px;
    text-align: left;
    width: 100%;

    &:hover {
      background-color: #393C43;
       width: 100%;
    }

    &.delete {
      color: #FF4D4D; /* 삭제 버튼 빨간색 */
    }

    &.edit {
      color: #ffffff; /* 수정 버튼 기본 흰색 */
    }
  }
`;


const imgRemoveBtn = styled.div`
 position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  
`;
const TrashIcon = styled(FaTrash)`
  font-size: 18px;
  color: #888;
  position: relative;
  top:-30px;
  right: 3px;
  &:hover {
    color: #ff4d4d; /* 휴지통 아이콘에 호버 시 색상 변경 */
  }
`;

const ChatMessage = ({ warnNkick, roomNumber, user, chatbanstatus, banWordList, setBanWordList, chatType, friend, roomData, setReloadState }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [textChatNo, setTextChatNo] = useState(0);
  const [senderCode, setSenderCode] = useState(user.userCode);
  const [senderName, setSenderName] = useState(user.userNickName);
  const [senderIcon, setSenderIcon] = useState(user.userIcon);
  const [messages, setMessages] = useState([]); // 서버에서 가져온거 쓸때
  const [editingChatguid, setEditingChatguid] = useState(null); // 수정 상태 관리
  const [editedMessage, setEditedMessage] = useState(''); // 수정 메시지 상태
  const [editText, setEditText] = useState('');
  const [getRoomNumber, setRoomNumber] = useState(0);

  const [openModalId, setOpenModalId] = useState(null);
  const [modalStyle, setModalStyle] = useState({display : 'none'});

  const [emojiList, setEmojiList] = useState([])
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [imgUUID, setImgUUID] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [gifSrc, setGifSrc] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const [isGifModalOpen, setIsGifModalOpen] = useState(false);

  const openGifModal = () => setIsGifModalOpen(true);
  const closeGifModal = () => setIsGifModalOpen(false);

  const inputRef = useRef(null);

  const messagesEndRef = useRef(null);  // 마지막 메시지로 스크롤을 이동시키기 위한 ref

  // 메시지가 변경될 때마다 자동으로 스크롤 맨 아래로 이동
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages]); // messages가 변경될 때마다 실행

  // 내 유저 정보가 담겨있는 함수
  useEffect(() => {
  }, [user]);

  useEffect(() => {
    if (editingChatguid) {
      inputRef.current?.focus();
    }
  }, [editingChatguid]);

  // 웹소켓 연결 함수
  const openSocket = () => {

    setMessages([]);

    if (ws && ws.readyState === WebSocket.OPEN) {
      return; // 이미 연결되어 있다면 추가 연결을 방지
    }

    let socket = null;
    if(textChatNo !== 0){
      socket = new WebSocket(`ws://localhost:9090/chat?userCode=${senderCode}&textChatNo=${textChatNo}`);
    }else {
      socket = new WebSocket(`ws://localhost:9090/chat?userCode=${senderCode}&textChatNo=0`)
    }
    socket.onopen = () => {
      // console.log('WebSocket connected');
    };
    socket.onerror = (error) => {
      //console.error('WebSocket Error:', error);
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
          textChatNo : data.textChatNo,
          chatImg: data.chatImg !== 'noChatImg' ? data.chatImg : null,
          gifSrc: data.gifSrc !== 'noGifSrc' ? data.gifSrc : null,
        };
        
        if(data.action === 'editMessage'){
          setEditText(data.editText)
          const updateMessage = newMessage;
          setMessages((prevMessages) => prevMessages.map(maps => maps.chatguid === updateMessage.chatguid ? {...maps, content : updateMessage.content , action : updateMessage.action, editText : updateMessage.editText} : maps));
        }else if(data.action === "welcomeMessage"){
          setReloadState(true);
          setMessages((prevMessages) => [...prevMessages, data]);
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }else if(data.action === "exitRoom"){
          setReloadState(true);
          setMessages((prevMessages) => [...prevMessages, data]);
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }else if(Number(data.userCode) === 0){
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }else if(Number(data.userCode) === 2070){
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }else {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
      } catch (err) {
        // console.error('Invalid JSON received', err);
      }
    };

    setWs(socket);
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // console.log("gif 확인" , chatbanstatus)
      // console.log("send Img", imgUUID)
      // console.log("send Img", imgSrc)
      // console.log("이미지 확인", imgUUID);
      //shg 침투@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      if (chatbanstatus) {
        const checkbanword = banWordList.some((banword) => message.includes(banword));
        //const checkeventword = eventWordList.some((eventword) => message.includes(eventword));
        if (checkbanword) {
          const timestamp = Date.now();
          const formattedMessage = JSON.stringify({
            action: "sendMessage",
            userCode: 2070,
            textChatNo: Number(textChatNo),
            userNickName: 'Nino',
            message: (senderName + `'s  message is deleted by nino-bot`),
            date: timestamp,
            userIcon: 'http://192.168.0.140/uploadImg/userImg/5e7ddea9-9963-439f-bb13-995d6eac6bf4_KakaoTalk_20250106_103447273.jpg',
          });
          ws.send(formattedMessage);
          if(warnNkick){
            BigBrother();
          }
        } else if (imgSrc !== null) {
          // console.log('이미지 확인 완료');
          const timestamp = Date.now();
          const formattedMessage = JSON.stringify({
            action: "sendMessage",
            userCode: senderCode,
            textChatNo: Number(textChatNo),
            userNickName: senderName,
            message: message !== '' ? message : ' ',
            date: timestamp,
            userIcon: senderIcon,
            img: imgUUID,
          });
          ws.send(formattedMessage);
        } else if(gifSrc !== null){
          const timestamp = Date.now();
          const formattedMessage = JSON.stringify({
            action: "sendMessage",
            userCode: senderCode,
            textChatNo: Number(textChatNo),
            userNickName: senderName,
            message: message !== '' ? message : ' ',
            date: timestamp,
            userIcon: senderIcon,
            gifSrc: gifSrc,
        });
        ws.send(formattedMessage);
      }
        else {
          const timestamp = Date.now();
          const formattedMessage = JSON.stringify({
            action: "sendMessage",
            userCode: senderCode,
            textChatNo: Number(textChatNo),
            userNickName: senderName,
            message: message,
            date: timestamp,
            userIcon: senderIcon,
          });
          ws.send(formattedMessage);  // 서버에 메시지 전송    
        }
      } else {
        const timestamp = Date.now();
        const formattedMessage = JSON.stringify({
          action: "sendMessage",
          userCode: senderCode,
          textChatNo: Number(textChatNo),
          userNickName: senderName,
          message: message !== '' ? message : ' ',
          date: timestamp,
          userIcon: senderIcon,
          gifSrc: gifSrc,
          img: imgUUID,
        });
        ws.send(formattedMessage);  // 서버에 메시지 전송        
      }
      setMessage('');  // 입력 필드 초기화  
      setImgSrc(null);
      setGifSrc(null); 
      setImgUUID(null);
    }
  };

  const closeSocket = () => {
      if(ws && ws.readyState === WebSocket.OPEN){
        const formattedMessage = JSON.stringify({
              action: "close"});
        ws.send(formattedMessage);
        ws.onclose();
        setWs(null);
      }
  };
  
 // 날짜 포맷팅 함수
 const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const btnClickHandler = (e, chatguid, userCode, content) => {
  const { name } = e.target;

  
  if (name === 'delete_text') {
    const deleteMessage = JSON.stringify({
      action: "deleteMessage",
      userCode: userCode,
      chatguid: chatguid,
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(deleteMessage);
    }
  } else if (name === 'modify_text') {
    setEditingChatguid(chatguid); // 수정모드
    setEditedMessage(content); // input필드에서 내용을 수정할수 있게하는거
  }
};

const saveEditedMessage = (chatguid) => {
  const editMessage = JSON.stringify({
    action: 'editMessage',
    userCode: senderCode,
    chatguid: chatguid,
    message: editedMessage,
    editText: editText,
  });

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(editMessage);
  }
};

useEffect( () => {
  if(editingChatguid !== null && editedMessage !== ''){
    setEditingChatguid(null);
    setEditedMessage('');
  }
}, [messages]);

useEffect( () => {
  if(Number(roomNumber) !== Number(getRoomNumber)){
    closeSocket();
    setRoomNumber(Number(roomNumber));
  }
}, [roomNumber]);

useEffect( () => {
  if(getRoomNumber !== 0 && getRoomNumber !== undefined && getRoomNumber !== null){
    // getRoomNumber 로 textChatNo 찾기
    axios.get('/chatting/api/getTextChatNo?roomNumber=' + getRoomNumber)
      .then(response => {
        setTextChatNo(response.data);
      })
      .catch(err => console.log(err));
  }
}, [getRoomNumber]);


useEffect( () => {
  if(textChatNo !== 0){
    openSocket();
  }
}, [textChatNo]);

const toggleModal = (e, chatguid) => {
  const styleModal = {
    display : 'flex',
    top : `${e.clientY}px`,
    left : `${e.clientX}px`
  };
  setModalStyle(styleModal);
  if (openModalId === chatguid) {
    setOpenModalId(null);
  } else {
    setOpenModalId(chatguid);
  }
};

const closeModal = () => {
  setOpenModalId(null);
};

const handleFileInputClick = (e) => {
  document.getElementById("fileInputMsg").click();

  // if(e.target.files[0] === null){
  //   setImageSrc(e.target.files[0]);

  // }
}



useEffect(() => {

}, [imgSrc])


const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    formData.append("uploadFile", file);

    try {
      const response = await axios.post('/api/room/uploadFile', formData)

      console.log("Fiile upload success" + response.data);
      setImgUUID("\\192.168.0.140/uploadImg/creator/" + response.data);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImgSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("File upload failed:", err);
    }

  }
};
//이미지 삭제
const handleDelete = () => {
  document.querySelector('#fileInputMsg').value = null;
  const removeUploadBtn = document.querySelector('#removeUploadBtn');
  removeUploadBtn.style.display = 'none';

  // 이미지 관련 상태 초기화
  setImgSrc(null);
  setImgUUID(null);
}

const BigBrother =() =>{
  axios
    .post(
      '/api/bot/bigbrother',
      {
        roomnumber: roomNumber,
        userCode : senderCode
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {          
      if(response.data === 'creater not'){
        console.log('방장은 강퇴 안됨');
      }else{
        console.log('big성공');
      }
    })
    .catch((error) => {
      console.error('Error auto warn & kick:', error);
    });
};

useEffect(() => {
  setEmojiList(emojiList => [...emojiList, selectedEmoji]);
}, [selectedEmoji])

useEffect(()=> {
  if (gifSrc) {
    sendMessage(gifSrc); // imgSrc가 업데이트되면 자동 호출
    console.log(gifSrc);
    setGifSrc('');
  }
},[gifSrc]);

const toggleVideoCall = () => {
  setIsVideoCallOpen((prevState) => !prevState);
}

return (
  <Container>
    <BodyArea id='chatBody'>
      { friend &&
        <VideoCall user={user} friend={friend}/>
      }
     {
        chatType ? 
        <HeaderArea>
        <h2>안녕하세요!</h2>
        <h1>{friend.userNickName}님 과 나눈 메세지의 첫 부분이에요.</h1>
        </HeaderArea>
        :
        <HeaderArea>
        <h2>{roomData !== null && roomData.roomTitle}에 오신걸 환영합니다.</h2>
        <p>이 서버가 시작된 곳이에요.</p>
        </HeaderArea>
      }
      {
        chatType ? 
        <RoomCreaterArea className='backgCon'>
          <img className="friend-chat-user-icon-chat" src={"http://192.168.0.140/uploadImg/userImg/" + friend.userIcon} 
            alt="" onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png";}}/>
          <div className="friend-chat-user-icon-nickName">
            {friend.userNickName}
          </div>
        </RoomCreaterArea>
        :
        null
      }
      <ChattingArea id='bodyArea' className='backgCon' style={friend ? {} : {minHeight : '87.3%'}}>
      {messages.length > 0 && messages.map((msg, index) => {
        const currentDate = formatDate(msg.date);
        const prevDate =  index > 0 ? formatDate(messages[index - 1].date) : null;
        const showDateDivider = currentDate !== prevDate;
        const myChatGuid = msg.chatguid;
        const myUserCode = msg.userCode;
      
        // 로컬 메시지 상태에서 즉시 삭제 반영
        msg.userCode === 0 && setMessages((prevMessages) =>
          prevMessages.filter((msgs) => msgs.chatguid !== msg.chatguid)
        );
        const isOwnMessage = msg.userCode === senderCode;

        return msg.userCode === undefined ? null : msg.userCode === 0 ? null : msg.userCode === 1 ? null : msg.textChatNo !== textChatNo ? null : msg.userIcon === 'welcome' ? 
        <WelcomArea>
          <ArrowIcon>
          </ArrowIcon>
          <span>
            {msg.userNickName} {msg.content}
          </span>
          <span style={{fontSize : '10.5px'}}>
            {new Date(msg.date).toLocaleTimeString()}
          </span>
        </WelcomArea>
        : msg.action === "welcomeMessage" ? 
        <WelcomArea>
          <ArrowIcon>
          </ArrowIcon>
          <span>
            {msg.userNickName} {msg.welcomeMessage}
          </span>
          <span style={{fontSize : '10.5px'}}>
          {msg.formattedDate}
          </span>
        </WelcomArea>
        : msg.action === 'exitRoom' ? 
        <WelcomArea>
          <ArrowIcon>
          </ArrowIcon>
          <span>
          {msg.userNickName} {msg.exitMessage}
          </span>
          <span style={{fontSize : '10.5px'}}>
          {msg.formattedDate}
          </span>
        </WelcomArea>
        : msg.userIcon === 'exitRoom'? 
        <WelcomArea>
        <ArrowIcon>
        </ArrowIcon>
        <span>
        {msg.userNickName} {msg.content}
        </span>
        <span style={{fontSize : '10.5px'}}>
        {new Date(msg.date).toLocaleTimeString()}
        </span>
      </WelcomArea>

        : (
          <ChatArea key={msg.chatguid}>
            {showDateDivider && (
              <DateDiv style={{ textAlign: 'center', margin: '10px 0' }}>
                <hr />
                <div style={{  padding: '0 10px' }}>{currentDate}</div>
              </DateDiv>
            )}
           {msg.userNickName === 'Nino' ?(
              <BotDiv>
            <img
              src="http://192.168.0.140/uploadImg/userImg/5e7ddea9-9963-439f-bb13-995d6eac6bf4_KakaoTalk_20250106_103447273.jpg"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                marginRight: "10px",
              }}
              alt=""
            />
            <ChatSection>
              <ChatSectionHeader>
                <strong data-code={msg.userCode}>{msg.userNickName}</strong>
                <IconWrapper>
                  <IconText>BOT</IconText>
                </IconWrapper>
                <span>{new Date(msg.date).toLocaleTimeString()}</span>
              </ChatSectionHeader>
              <BotChatSectionOne>
                {msg.content}{" "}
                {msg.action === "editMessage" && <span>{msg.editText}</span>}
              </BotChatSectionOne>
            </ChatSection>
          </BotDiv> ) : (
            <ChatDiv isOwnMessage={isOwnMessage}>
             <img
                src={"http://192.168.0.140/uploadImg/userImg/" + msg.userIcon}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  marginRight: '10px',  // 자기 메시지일 경우 왼쪽에 위치하게 설정
                  marginLeft: isOwnMessage ? '0' : '10px', // 자기 메시지일 경우 오른쪽에 아이콘
                }}
                alt='' 
                onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png";}}
              />
             <ChatSection>
                        <ChatSectionHeader isOwnMessage={isOwnMessage}>
                          <strong data-code={msg.userCode}>{msg.userNickName}</strong>
                          <span>{new Date(msg.date).toLocaleTimeString()}</span>
                          {
                            myChatGuid === msg.chatguid && msg.userCode === user.userCode ? (
                              <IconButton onClick={(e) => toggleModal(e, msg.chatguid)}>
                                <BsThreeDots style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '24px' }} />
                              </IconButton>
                            ) : null
                          }
                          {openModalId === msg.chatguid && (
                            <Modal style={modalStyle}>
                              <button
                                className="edit"
                                type="button"
                                name="modify_text"
                                onClick={(e) =>
                                  btnClickHandler(e, msg.chatguid, msg.userCode, msg.content)
                                }>
                                <FaEdit />
                                수정하기
                              </button>

                              <button
                                type="button"
                                className="delete"
                                name="delete_text"
                                onClick={(e) => btnClickHandler(e, msg.chatguid, msg.userCode)}>
                                <FaTrashAlt />
                                삭제하기
                              </button>
                            </Modal>
                          )}
                        </ChatSectionHeader>
                        {openModalId && <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 9, }} />}

                        {editingChatguid === msg.chatguid ? (
                          <div>
                            <input
                              type="text"
                              name='inputBox'
                              ref={inputRef}
                              value={editedMessage}
                              onChange={(e) => setEditedMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  saveEditedMessage(msg.chatguid);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  setEditingChatguid(null);
                                }
                              }}
                            />
                            <span>ESC 키로 취소 • Enter 키로 저장</span>
                          </div>
                        ) : (
                          <ChatSectionOne isOwnMessage={isOwnMessage}>
                            <span>{msg.content}</span>
                            {msg.action === "editMessage" && <span>{msg.editText}</span>}
                            {
                              (msg.chatImg || msg.gifSrc) && (
                                <div>
                                  {msg.chatImg && <img src={msg.chatImg} alt="chatImg" style={{ width: '230px', height: 'auto' , objectfit: 'cover',  borderRadius: '0'}} />}
                                  {msg.gifSrc && <img src={msg.gifSrc} alt="gifSrc" style={{ width: "100%", height:'auto', borderRadius: "10px" }}/>}
                                </div>
                              )
                            }
                          </ChatSectionOne>
                        )}
                      </ChatSection>
            </ChatDiv>
        )
      }
          </ChatArea>
        )
      })}
      <div ref={messagesEndRef} />
      </ChattingArea>
    </BodyArea>
    <FooterArea className='backgCon'>
        <InputContainer>
          {/* 파일 업로드 버튼 */}
          <RoundButton onClick={handleFileInputClick}>
            <i className="bi bi-plus"></i>
          </RoundButton>
          <input
            type="file"
            id="fileInputMsg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />


          {imgSrc && <img src={imgSrc} alt="Uploaded Preview" style={{ width: '100px', height: 'auto' }} />}
          {imgSrc && <imgRemoveBtn id="removeUploadBtn" onClick={handleDelete}><TrashIcon /></imgRemoveBtn>}

          {/* 입력 필드 */}
          <StyledInput
            type="text"
            id="chatInput"
            placeholder="@채팅메시지 보내기"
            value={message + (emojiList.length > 0 ? ' ' + emojiList.join(' ') : '')} // 메시지와 이모티콘 표시
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const finalMessage = message.trim() + (emojiList.length > 0 ? ' ' + emojiList.join(' ') : '');
                sendMessage(finalMessage.trim());
                setMessage('');
                setEmojiList([]);
                setImgSrc(null);
              }
            }}
            onFocus={() => {
              // 인풋 포커스 시 추가된 이모티콘을 바로 `message`로 병합
              if (emojiList.length > 0) {
                setMessage((prev) => prev.trim() + ' ' + emojiList.join(' '));
                setEmojiList([]); // emojiList 초기화
              }
            }}
          />


          {/* 오른쪽 아이콘들 */}
          {/* <IconButton>
            <i className="bi bi-headset"  onClick={toggleVideoCall}></i> 
          </IconButton> */}

          <IconButton>
          <i className="bi bi-filetype-gif" onClick={openGifModal}>{/* GIF 아이콘 */}</i>
              
            {/* 모달이 열리면 모달 컴포넌트 렌더링 */}
            <GifModal isOpen={isGifModalOpen} onClose={closeGifModal}  setGifSrc={setGifSrc}/>
          </IconButton>
          <IconButton>
            <EmojiPicker setSelectedEmoji={setSelectedEmoji} /> {/* 이모티콘 아이콘 */}
          </IconButton>
          <IconButton>
            <i
              className="bi bi-send-fill"
              onClick={() => {
                if (message.trim() !== '' || emojiList.length > 0) {
                  const finalMessage = message.trim() + (emojiList.length > 0 ? ' ' +  emojiList.join(' ') : '').trim();
                  const intputElement = document.getElementById('chatInput');
                 
                  if(intputElement){
                    intputElement.focus();
                    setMessage((prev) => prev.trim() + ' ' + emojiList.join(' '));
                    setEmojiList([]); // emojiList 초기화
                  }  
                  // console.log("보내기전",finalMessage);
                  sendMessage(finalMessage);
                  setMessage('');
                  // console.log("보낸후",finalMessage);

                  // setEmojiList([]); 
                  setImgSrc(null);
                }
              }}
            ></i> {/* 전송 아이콘 */}
          </IconButton>
        </InputContainer>
    </FooterArea>
  </Container>
);
};


export default ChatMessage;