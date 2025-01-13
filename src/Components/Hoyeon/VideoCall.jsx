import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled, { css, keyframes } from 'styled-components';
import Friend from "../Seoyeon/Friend/Friend";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 20px;
  background-color: ${props => props.color || "transparent"};
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 65.1%;
    margin-left: 139px;
    background-color: rgba(30, 31, 34, 0.7);
    height: 26%;
    margin-top: 50px;
    display: flex
;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
  text-align: center;
  color: white;
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const Circle = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: ${props => props.color || "transparent"};
  animation: pulse 1.5s infinite ease-in-out;
  ${props => props.delay && `animation-delay: ${props.delay};`}
`;

const HighlightedCircle = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: ${props => props.color || "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;

  ${props =>
    props.highlight &&
    css`
      border: 4px solid rgb(1, 205, 154);  /* 하이라이트 효과로 테두리 추가 */
      animation: ${pulseAnimation} 1.5s infinite;  /* 애니메이션 추가 */
    `}
`;
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 45px;
  margin-top: 20px;
`;

const IconCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3C3E43;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: red;  /* Darken on hover */
  }
`;

const AnswerIconCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3C3E43;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: green;  /* Darken on hover */
  }
`;

const Icon = styled.i`
  font-size: 20px;
  color: white;
  transform: translateY(${props => props.transform || "0px"});

  ${IconCircle}:hover & {
    color: white;
  }
`;

const VideoCall = ({ user, friend }) => {
  const socketRef = useRef();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef();
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [offerSdp, setOfferSdp] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const roomName = '1';

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      if (!(pcRef.current && socketRef.current)) return;

      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          if (!socketRef.current) return;
          socketRef.current.emit("candidate", e.candidate, roomName);
        }
      };

      pcRef.current.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };
    } catch (e) {
      console.error(e);
    }
  };

  const createOffer = async () => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      const sdp = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(sdp);
      socketRef.current.emit("offer", sdp, roomName);
      setIsCalling(true);
      setIsModalVisible(true);
    } catch (e) {
      console.error(e);
    }
  };

  const createAnswer = async () => {
    
    if (!(pcRef.current && socketRef.current)) return;
    if (!offerSdp) {
      console.error("Received invalid SDP:", offerSdp);
      return;
    }

    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offerSdp));

      const answerSdp = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answerSdp);

      socketRef.current.emit("answer", answerSdp, roomName);
      setIsReceivingCall(false);
      setIsCalling(true);
      setIsModalVisible(true);
    } catch (e) {
      console.error("Error during createAnswer:", e);
    }
  };

  useEffect(() => {
    socketRef.current = io("http://192.168.0.158:8081");

    pcRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    socketRef.current.on("getCandidate", async (candidate) => {
      if (pcRef.current) {
        if (pcRef.current.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(candidate);
          } catch (error) {
            console.error("Error adding ice candidate:", error);
          }
        }
      }
    });

    socketRef.current.on("getOffer", (sdp) => {
      setOfferSdp(sdp);
      setIsReceivingCall(true);
    });

    socketRef.current.on("getAnswer", (sdp) => {
      if (pcRef.current) {
        pcRef.current.setRemoteDescription(sdp);
      }
    });

    socketRef.current.emit("join_room", { room: roomName });

    getMedia();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);
  
  return (
    <Container>
    {!isCalling && !isReceivingCall && (
        <div onClick={createOffer} style={{cursor : 'pointer', display : 'flex', alignItems : 'center'}}><h1 style={{ fontSize: '20px' , marginRight : '10px'}}>{friend.userNickName}님에게 전화걸기</h1>
        <Icon className="bi bi-telephone-fill" transform="-2px" style={{color : 'black', backgroundColor : '#34c759', borderRadius : '50%', width : '35px', height : '35px', textAlign : 'center', alignContent : 'center'}}/>
        {/* <img src={"http://192.168.0.140/uploadImg/userImg/" + friend.userIcon} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }}/> */}
        </div>
      )}

      {isReceivingCall && !isCalling && (
        <ModalContainer>
          <ModalContent>
            {/* <h3>전화가 걸려왔습니다</h3> */}
            <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
              {/* <HighlightedCircle color="green" highlight={true} /> */}
              <HighlightedCircle>
                <img 
                  src={"http://192.168.0.140/uploadImg/userImg/" + friend.userIcon} 
                  alt="friendIcon"
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png"; 
                  }} style={{ width: "130px", height: "130px", borderRadius: "50%" }}/>
              </HighlightedCircle>

              {/* 발신자 */}
              <HighlightedCircle highlight={true}>
              <img src={"http://192.168.0.140/uploadImg/userImg/" + user.userIcon} alt="userIcon" style={{ width: "130px", height: "130px", borderRadius: "50%" }}  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src ="http://192.168.0.140/uploadImg/userImg/user-icon2.png"; 
                  }} />
              </HighlightedCircle>
            </div>
            <IconContainer>
              <AnswerIconCircle
                onClick={createAnswer}
              >
                <Icon className="bi bi-telephone-fill" transform="-2px"/>
              </AnswerIconCircle>
              <IconCircle
                onClick={() => {
                  setIsReceivingCall(false);
                  socketRef.current.emit("reject_call", roomName);
                  setIsModalVisible(false);
                }}
              >
                <Icon className="bi bi-x-circle-fill" transform="-2px" />
              </IconCircle>
            </IconContainer>
            <br></br>
            {/* <img src={user.userIcon} alt="userIcon" /> */}
            {/* <p>전화가 걸려왔습니다</p> */}
          </ModalContent>
        </ModalContainer>
      )}

      {isModalVisible && (
        <ModalContainer>
          <ModalContent>
            {/* <h3>전화가 진행 중입니다</h3> */}
            <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
              {/* <HighlightedCircle color="green" highlight={true} /> */}
              <HighlightedCircle highlight={true}>
                <img 
                  src={"http://192.168.0.140/uploadImg/userImg/" + friend.userIcon} 
                  alt="friendIcon"
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png"; 
                  }}style={{ width: "130px", height: "130px", borderRadius: "50%" }}/>
              </HighlightedCircle>
              
              {/* 발신자 */}
              <img src={"http://192.168.0.140/uploadImg/userImg/" + user.userIcon} alt="userIcon" style={{ width: "130px", height: "130px", borderRadius: "50%" }}  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "http://192.168.0.140/uploadImg/userImg/user-icon2.png"; 
                  }} />
            </div>

            <IconContainer>
              <IconCircle>
                <Icon className="bi bi-camera"  transform="-1px" />
              </IconCircle>
              <IconCircle>
                <Icon className="bi bi-mic-fill" transform="-1px" />
              </IconCircle>
              <IconCircle>
                {isCalling && (
                  <span
                    onClick={() => {
                      setIsCalling(false);
                      socketRef.current.emit("end_call", roomName);
                      setIsModalVisible(false);
                    }}
                  >
                    <Icon className="bi bi-x-lg" transform="-1px" />
                  </span>
                )}
              </IconCircle>
            </IconContainer>
              <br></br>
            {/* <p>전화 연결 중...</p> */}
          </ModalContent>
        </ModalContainer>
      )}
    </Container>
  );
};

export default VideoCall;
