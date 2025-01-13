import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";

const signalingServerUrl = "ws://localhost:9080/chat";

const VideoChat = ({ user }) => {
  const [isInitiator, setIsInitiator] = useState(false); // 전화 걸기 상태
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false); // 통화 중 여부
  const [waitingForResponse, setWaitingForResponse] = useState(false); // 전화 응답 대기 상태
  const [callReceived, setCallReceived] = useState(false); // 전화가 왔는지 여부
  const userCode = user.userCode;

  const localAudioRef = useRef();
  const remoteAudioRef = useRef();

  // WebSocket 연결 설정 및 유지
  const connectWebSocket = () => {
    console.log("Attempting to connect WebSocket...");
    const ws = new WebSocket(`${signalingServerUrl}?userCode=${userCode}`);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("웹소켓 메시지 수신:", event.data); // 디버깅 로그 추가
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed message:", data); // 메시지 파싱 결과 로그
        if (!data.action) {
          console.warn("Received message without an action key:", data);
          return;
        }

        handleWebSocketMessage(data);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onclose = (event) => {
      console.warn("WebSocket connection closed.", event.code, event.reason);
      setSocket(null);

      if (!event.wasClean) {
        console.log("Reconnecting WebSocket...");
        setTimeout(connectWebSocket, 5000); // 5초 후 재시도
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection...");
        socket.close();
      }
    };
  }, [userCode]);

  const handleWebSocketMessage = (data) => {
    if (data.from === userCode) {
      return; // 자기 자신이 보낸 메시지는 무시합니다.
    }

    console.log("Handling WebSocket message:", data); // 메시지 처리 로그

    switch (data.action) {
      case "call":
        console.log("Received 'call' action");
        handleCallRequest(data);
        break;
      case "signal":
        console.log("Received 'signal' action");
        handleSignal(data);
        break;
      case "endCall":
        console.log("Received 'endCall' action");
        handleEndCall();
        break;
      case "declineCall":
        console.log("Received 'declineCall' action");
        alert("상대방이 전화를 거부했습니다.");
        setWaitingForResponse(false);
        setCallReceived(false);
        break;
      case "cancelCall":
        console.log("Received 'cancelCall' action");
        alert("상대방이 전화를 취소했습니다.");
        setWaitingForResponse(false);
        setCallReceived(false);
        break;
      case "callAccepted":
        console.log("Received 'callAccepted' action");
        handleCallAccepted(data); // 발신자에서 호출되는 함수
        break;
      default:
        console.warn("Unknown action received:", data.action);
    }
  };

  const handleCallRequest = (data) => {
    console.log("Handling call request from:", data.from);
    if (userCode !== 1) {
      setIsInitiator(false);
      setCallReceived(true); // 전화 수신 대기
    }
  };

  const handleSignal = (data) => {
    console.log("Handling signal...");
    if (peer) {
      try {
        console.log("Sending signal to peer:", data.signal);
        peer.signal(data.signal);
      } catch (err) {
        console.error("Error handling signal:", err);
      }
    } else {
      console.log("Peer is not initialized yet.");
    }
  };

  const handleEndCall = () => {
    console.log("Handling end call...");
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    if (localAudioRef.current) localAudioRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    console.log("Peer connection ended.");
    alert("통화가 종료되었습니다.");
    setIsCallActive(false);
  };

  const startCall = async () => {
    console.log("Starting call...");
    
    // 발신자가 WebSocket 연결이 되어있고, peer가 아직 초기화되지 않았다면
    if (!peer && socket && socket.readyState === WebSocket.OPEN) {
      try {
        // 로컬 오디오 스트림을 가져옴
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        console.log(stream);
  
        // 로컬 오디오 스트림을 연결
        localAudioRef.current.srcObject = stream;
  
        console.log(localAudioRef.current.srcObject);

        // 새로운 Peer 객체를 생성
        const newPeer = new Peer({
          initiator: isInitiator,
          trickle: true,
          stream: stream, // 로컬 스트림을 Peer에 설정
        });

        console.log(newPeer);
  
        setPeer(newPeer);
  
        // 시그널 데이터를 수신하면 서버로 전송
        newPeer.on("signal", (signalData) => {
          console.log("Sending signal:", signalData);
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                action: "signal",
                signal: signalData,
                from: userCode,
              })
            );
          }
        });
  
        // 상대방의 미디어 스트림을 수신하면 연결
        newPeer.on("stream", (remoteStream) => {
          console.log("Received remote stream");
          remoteAudioRef.current.srcObject = remoteStream;
        });
  
        // Peer 연결이 완료되면 연결된 상태 출력
        newPeer.on("connect", () => {
          console.log("Peer connection established.");
        });
  
        // 연결이 종료되면 끝내는 함수 호출
        newPeer.on("close", handleEndCall);
        
      } catch (err) {
        console.error("Failed to access media devices:", err);
      }
    } else {
      // WebSocket 연결이 안되었으면 재시도
      setTimeout(connectWebSocket, 3000); 
    }
  };
  
  const handleCall = async () => {
    setIsInitiator(true);
    setWaitingForResponse(true);
    alert("상대방이 전화를 수락할 때까지 기다려주세요.");

    if (!peer && socket && socket.readyState === WebSocket.OPEN) {
      try {
        // 로컬 오디오 스트림을 가져옴
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        console.log(stream);
  
        // 로컬 오디오 스트림을 연결
        localAudioRef.current.srcObject = stream;
  
        console.log(localAudioRef.current.srcObject);

        // 새로운 Peer 객체를 생성
        const newPeer = new Peer({
          initiator: isInitiator,
          trickle: true,
          stream: stream, // 로컬 스트림을 Peer에 설정
        });

        console.log(newPeer);
  
        setPeer(newPeer);
  
        // 시그널 데이터를 수신하면 서버로 전송
        newPeer.on("signal", (signalData) => {
          console.log("Sending signal:", signalData);
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                action: "signal",
                signal: signalData,
                from: userCode,
              })
            );
          }
        });
  
        // 상대방의 미디어 스트림을 수신하면 연결
        newPeer.on("stream", (remoteStream) => {
          console.log("Received remote stream");
          remoteAudioRef.current.srcObject = remoteStream;
        });
  
        // Peer 연결이 완료되면 연결된 상태 출력
        newPeer.on("connect", () => {
          console.log("Peer connection established.");
        });
  
        // 연결이 종료되면 끝내는 함수 호출
        newPeer.on("close", handleEndCall);
        
      } catch (err) {
        console.error("Failed to access media devices:", err);
      }
    } else {
      // WebSocket 연결이 안되었으면 재시도
      setTimeout(connectWebSocket, 3000); 
    }

    console.log("Sending 'call' action to server...");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "call",
          from: userCode,
        })
      );
    } else {
      alert("WebSocket 연결 상태를 확인하세요.");
    }
  };

  const cancelCall = () => {
    console.log("Cancelling call...");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "cancelCall",
          from: userCode,
        })
      );
    }
    setWaitingForResponse(false);
    setIsCallActive(false);
    alert("전화가 취소되었습니다.");
  };

  const handleAcceptCall = () => {
    console.log("Accepting call...");
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsCallActive(true);
      setCallReceived(false);
      setWaitingForResponse(false);
      startCall();
      console.log("Call accepted and starting peer connection...");
      
      // 수신자가 발신자에게 'callAccepted' 메시지 전송
      socket.send(
        JSON.stringify({
          action: "callAccepted",
          from: userCode, // 수신자가 발신자에게 callAccepted 메시지 전송
        })
      );
    } else {
      alert("WebSocket 연결 상태를 확인하세요.");
    }
  };

  const handleDeclineCall = () => {
    console.log("Declining call...");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "declineCall",
          from: userCode,
        })
      );
    }
    setCallReceived(false); // 전화 거절
    alert("전화가 거절되었습니다.");
  };

  const handleCallAccepted = (data) => {
    console.log("Handling call accepted from:", data.from);
    setIsCallActive(true);
    setWaitingForResponse(false);
    setCallReceived(false);

    // 발신자는 여기서 다시 통화를 시작해야 합니다.
    startCall(); // 발신자에서 callAccepted 받으면 startCall 호출
  };

  return (
    <div>
      <h1>React Audio Chat {user.userCode}</h1>
      <div>
        {!isCallActive ? (
          <>
            <button onClick={handleCall} disabled={waitingForResponse}>
              전화 걸기
            </button>
            {waitingForResponse && (
              <button onClick={cancelCall}>전화 취소</button>
            )}
          </>
        ) : (
          <button onClick={handleEndCall}>통화 종료</button>
        )}

        {/* 수신 전화에 대한 수락/거절 버튼 */}
        {callReceived && !isCallActive && (
          <div>
            <p>상대방이 전화를 걸었습니다.</p>
            <button onClick={handleAcceptCall}>수락</button>
            <button onClick={handleDeclineCall}>거절</button>
          </div>
        )}
      </div>

      <div>
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoChat;
