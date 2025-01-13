import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function FindUserData(props) {

    const [userEmail, setUserEmail] = useState('');

    const [userPassword, setUserPassword] = useState('');

    const [passwordCode, setPasswordCode] = useState('');

    const [resultCode, setResultCode] = useState(0);

    const [isPasswordState, setIsPasswordState] = useState(false);

    const [isResultCheck, setIsResultCheck] = useState(false);

    const nav = useNavigate();

    const handleInputChange = (e) => {
        if(e.target.name === 'userEmail'){
            setUserEmail(e.target.value);
        }else if(e.target.name === 'passwordCode'){
            setPasswordCode(e.target.value);
        }else if(e.target.name === 'userPassword'){
            setUserPassword(e.target.value);
        }
    }

    const handleLoginBtn = () => {
        axios.get(`/user/api/passwordResult?userEmail=${userEmail}`)
            .then(response => {
                if(response.data === 'fail'){
                    alert('등록되지 않은 이메일 주소 입니다.');
                    return;
                }else {
                    alert('이메일이 발송되었습니다.');
                    setResultCode(Number(response.data));
                    setIsPasswordState(!isPasswordState);
                    return;
                }
            })
    }

    const handlePasswordInput = () => {
        if(Number(resultCode) === Number(passwordCode)){
            setIsResultCheck(!isResultCheck);
        }
    }

    const handlePasswordUpdate = () => {
        if(userPassword.length > 3){
            axios.post('/user/api/passwordUpdateByEmail', {userEmail : userEmail, userPassword : userPassword})
            .then(response => {
                if(response.data === 'success'){
                    alert('비밀번호 변경이 완료되었습니다. 로그인 페이지로 이동합니다.');
                    nav('/login');
                }else {
                    alert('다른 비밀번호를 입력 해 주세요');
                    return;
                }
            })
            .catch(err => console.error(err));
        }
    }

    return (
        <Container>
            <InputArea>
            {!isResultCheck ? 
            <RegisterDiv>
                    <h2 style={{marginBottom : '0'}}>비밀번호를 잊으셨나요?</h2>
                    <p style={{color : 'silver' , fontSize : '15px' , margin : 'none'}}>가입하신 이메일을 입력 해 주세요</p>
                    {!isPasswordState && <UserInputSection>
                        <p>이메일</p>
                        <input type="text" name='userEmail' value={userEmail} placeholder='이메일을 입력해주세요' onChange={handleInputChange}/>
                    </UserInputSection>}
                    {
                        isPasswordState && 
                    <UserInputSection>
                        <p>인증번호 입력</p>
                        <input type="text" name='passwordCode' value={passwordCode} placeholder='인증 번호를 입력 해 주세요' onChange={handleInputChange}/>
                    </UserInputSection>
                    }
                    <BtnDiv>
                        {!isPasswordState ? 
                            <BtnSection>
                                <button className='gradient-box' type="button" onClick={handleLoginBtn}>인증번호 발송</button>
                            </BtnSection>
                            :
                            <BtnSection>
                                <button className='gradient-box' type="button" onClick={handlePasswordInput}>인증번호 입력</button>
                            </BtnSection>
                        }
                    </BtnDiv>
                </RegisterDiv>
                :
                <RegisterDiv>
                    <h2 style={{marginBottom : '0'}}>변경하실 비밀번호를 입력하세요</h2>
                    <p style={{color : 'silver' , fontSize : '15px' , margin : 'none'}}>비밀번호는 최소 4글자 이상입니다.</p>
                    <UserInputSection>
                        <p>새 비밀번호 입력</p>
                        <input type="text" name='userPassword' value={userPassword} placeholder='새로운 비밀번호를 입력해주세요' onChange={handleInputChange}/>
                    </UserInputSection>
                    <BtnDiv>
                        <BtnSection>
                            <button className='gradient-box' type="button" onClick={handlePasswordUpdate}>비밀번호 변경</button>
                        </BtnSection>
                    </BtnDiv>
                </RegisterDiv>
                }
            </InputArea>
        </Container>
    );
}

const Container = styled.div`
    margin-left: 15%;
    margin-right: 15%;
    display: flex;
    justify-content: center;
    height: 800px;
`;

const InputArea = styled.div`
    margin-top: 17%;
    width: 800px;
    height: 410px;
    display: flex;
    border-radius: 4px;
    flex-direction: row;
    background-color: #3C3E43;
    color: white;
    overflow-y: auto;
`;

const RegisterDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
        font-weight: 400;
        font-size: 14px;
    }
    input[type='text'], input[type='password']{
        width: 100%;
        height: 40px;
        background-color: #232428;
        border-radius: 4px;
        border: none;
        color: white;
        padding-left: 10px;
    }
    input[type='checkbox']{
        width: 24px;
        height: 24px;
        cursor: pointer;
        appearance: none; /* 기본 체크박스 스타일 제거 */
        border-radius: 5px; /* 둥글게 만들기 */
        border: 1px solid white; /* 테두리 설정 */
        transition: background-color 0.2s ease, border-color 0.2s ease;

        
        &:hover {
            border-color: #888;
        }
    }
    input[type='checkbox']:checked {
        background-color: #3c48cf;
        background-repeat: no-repeat;
        background-position: center;
    }
`;

const UserInputSection = styled.div`
    margin: 5px;
    width: 60%;
    height: 20%;
    margin-bottom: 10px;
`;


const BtnDiv = styled.div`
    margin: 5px;
    width: 50%;
    height: 17%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const BtnSection = styled.div`
    margin-left: 10px;
    width: 92%;
    button{
        border-radius: 4px;
        border: none;
        width: 100%;
        height: 44px;
        margin-top: 15px;
        font-weight: bold;
        font-size: 1.2rem;
        /* background-color: #01CD9A; */
        background-color : #01CD9A;
        transition : 0.7s;
        transition: background-image 0.5s ease; /* 자연스러운 전환 */
    }

    button:hover {
        cursor: pointer;
        font-weight: bold;
        transition : 0.7s;
        /* background-image: linear-gradient(-108.47038220091133deg, rgba(43, 240, 191,1) 30.898437499999996%, rgba(43, 240, 191,1) 34.371744791666664%, rgba(14, 227, 206,1) 56.68511284722222%, rgba(24, 198, 214,1) 81.41927083333333%); */
;
        /* background-color: #04e7af; */
    }
`;

export default FindUserData;