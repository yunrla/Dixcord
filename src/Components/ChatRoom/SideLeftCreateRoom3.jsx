import React, { useState } from 'react';
import styled from 'styled-components';
import SideLeftCreateRoom1 from './SideLeftCreateRoom1';
import SideLeftCreateRoom4 from './SideLeftCreateRoom4';
import Alert from '../Alert/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    position: fixed; /* 화면에 고정 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; /* 컨텐츠보다 위에 표시 */
    color: #e0e0e0;
`;
const Container = styled.div`
    text-align: center;
    border-radius: 1%;
    width: 600px;
    padding: 30px;
    margin: 0 auto;
    position: relative;
    background-color: rgba(42, 42, 42, 0.8);  
    z-index: 1000;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.2);    
    `
const Header = styled.header`
    width: 90%;
    text-align: center;
    margin: 0 auto;
    `

const Body = styled.div`
  p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }

    `

const Button = styled.button`
    background-color: rgba(42, 42, 42, 0.8); 
    color:#01CD9A;
    padding: 10px;
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {   
        transform: scale(1.05);
    }
    `
const Section = styled.section`
 
    `
const Section2 = styled.section`
    margin: 5%;
    `
const Div = styled.div`
    display: flex;
    margin: 10px;
    gap: 30px;
    justify-content: center;
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

const Input = styled.input`
     background-color: white;
    border: 1px solid #ada9a9;
    padding: 15px;
    margin: 15px;
`

const Footer = styled.div``
const H3 = styled.h3` margin: 0%
`
const H1 = styled.h1``
function SideLeftCreateRoom3({ create3, setCreate3, create1, data, setRoomNum, ws, backStatus }) {

    const nav = useNavigate();

    const [putCode, setPutCode] = useState('');

    const [isClose, setIsClose] = useState(false);
    const [message, setMessage] = useState('');


    const handleOnClose = () => {
        setIsClose(false);
    }

    const goBack = () => {
        setCreate3(false);
        create1(true);
    }

    const handleModalClose = () => {
        setCreate3(false);
    }

    /* const handleOnclickRoom = (e) => {
        rightSide('room');
        nav('/room/' + e.target.getAttribute('num'));
        // roomStatus('chatRoom');
    } */

       
    const handleCode = (e) => {
        setPutCode(() => e.target.value);
        
    } 
  
    
    const  goRoom = () => {

        if(!putCode){
            setIsClose(true);
            setMessage('초대코드를 입력하세요!');
            return;
        }
        
        axios.get('/api/room/isInvited?putCode=' + putCode)
        .then(response => {

            if(response.data >0){
                
                const roomData = {
                    roomNumber : response.data,
                    userCode : data.userCode,
                    auth : '참여자'                        
                }



                axios.post("/api/room/addChatMember", roomData )
                    .then(response => {
                        if(response.data === 0){
                            setIsClose(true);
                            setMessage('입장실패');
                            return;
                        }else if(response.data === 999){
                             setIsClose(true);
                             setMessage('이미 참가 중인 방입니다.');
                        }else {
                            const timestamp = Date.now();
                            const formattedMessage = JSON.stringify({
                                action: "welcomeMessage",
                                userCode: data.userCode,
                                roomNumber : Number(roomData.roomNumber),
                                userNickName: data.userNickName,
                            });
                            ws.send(formattedMessage); 
                            nav('/room/' + roomData.roomNumber);
                            setRoomNum(Number( roomData.roomNumber));
                            setCreate3(false);
                            setPutCode('');
                        }
                    });

                }else{
                    setIsClose(true);
                    setMessage('초대 코드가 일치하지 않습니다.');
                }
            })
            .catch();

       

    }



    return (
        <>
            <Wrapper style={create3 === true ? { display: 'flex' } : { display: 'none' }}>
                <Container>
                    <Header>
                        <Span onClick={handleModalClose}>&times;</Span>
                        <H1>방 참가하기</H1>
                        <p>아래에 초대코드를 입력하여 방에 참가하세요.</p><br />
                    </Header>
                    <Body>
                        <Section>
                            <H3>초대 코드</H3>
                            <Input id="inviteCode" type="number" placeholder='초대코드를 입력하세요' onChange={handleCode} value={putCode} />
                        </Section>
                        <Section2>
                            <p>초대는 다음 형태여야 해요. (숫자 6자리)</p>
                            <p>ex) 123456</p>
                        </Section2>
                    </Body>
                    <Footer>
                        <Div>

                            <Button onClick={goBack} style={backStatus ? {display: 'block'} : {display : 'none'}}>뒤로가기</Button>


                            <Button onClick={goRoom}>방 들어가기</Button>

                        </Div>
                    </Footer>

                </Container>
                {isClose && <Alert message={message} onClose={handleOnClose}/>}
            </Wrapper>

        </>
    );
}

export default SideLeftCreateRoom3;