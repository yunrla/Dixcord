import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";

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

const modalArea = styled.div`

`;

const SocialDiv = styled.div`
    width: 35%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px; /* 버튼 간격 */
    width: 300px;
`;

const RegisterDiv = styled.div`
    width: 65%;
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
    width: 90%;
    height: 20%;
    margin-bottom: 10px;
`;

const RedStarSpan = styled.span`
    color: red;
`;

const BtnDiv = styled.div`
    margin: 5px;
    width: 100%;
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
        background-image: linear-gradient(108.47038220091133deg, rgba(43, 240, 191,1) 30.898437499999996%,rgba(43, 240, 191,1) 34.371744791666664%,rgba(14, 227, 206,1) 56.68511284722222%,rgba(24, 198, 214,1) 81.41927083333333%);
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
const LinkSection = styled.div`
    width: 90%;
    margin-top: 15px;
    a {
        color: #007AFF;
        text-decoration: none;
    }
`;

const SocialLogin = styled.div`
    width: 80%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover {
        cursor: pointer;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    img{
        width: 40px;
        height: 40px;
        margin-right: 30px;
    }
`;

const Divider = styled.div`
    border-bottom: 1px solid #ccc;
    width: 90%;
    margin-bottom: 25px;
`;

function Login({data, status}) {

    // const location = useLocation();

    const nav = useNavigate();

    const [user, setUser] = useState({
        username : '',
        password : ''
    });

    const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
    const REDIRECT_URI = "http://localhost:3000";
    const SCOPE = process.env.REACT_APP_GOOGLE_SCOPE;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser(prev => ({
            ...prev,
            [name] : value
        }));
    }

    const handleLoginBtn = () => {
        document.querySelector('#passwordFail2').style.display = 'none';
            document.querySelector('#emailFail2').style.display = 'none';
            document.querySelector('#emailFail1').style.display = 'none';
            document.querySelector('#passwordFail1').style.display = 'none';
        if(user.username === ''){
            // 이메일 미입력
            document.querySelector('#emailFail1').style.display = 'contents';
            return;
        }
        if(user.password === ''){
            // 비밀번호 미입력
            document.querySelector('#passwordFail1').style.display = 'contents';
            return;
        }
        axios.post('/test/api/login', user)
        .then((response) => {
            if(response.data === 'Login successful'){
                status(true);
                nav('/');
            }else {

            }
        })
        .catch(() => {
                document.body.style.cursor = 'progress';
                document.querySelector('button').style.cursor = 'progress';
                setTimeout(() => {
                    document.querySelector('#passwordFail2').style.display = 'contents';
                    document.querySelector('#emailFail2').style.display = 'contents';
                    document.querySelector('button').style.cursor = '';
                    document.body.style.cursor = '';
                }, 1200);
            });
    }

    const handleSocialLogin = (e) => {
        const socialLogin = e.target.getAttribute('name');
        if(socialLogin === 'google'){
            const encodeRedi = encodeURI('http://localhost:3000/googleLogin');
            const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&include_granted_scopes=true&response_type=token&redirect_uri=${encodeRedi}&client_id=638388672123-64sgadord0481eq5k9mmj1tab190vjht.apps.googleusercontent.com`;

   
            window.location.href = googleOAuthUrl;

            // const popup = window.open(googleOAuthUrl, "googleLogin", "width=600,height=400,top=300,left=600");
            // if (!popup || popup.closed || typeof popup.closed == 'undefined') {
            //     alert("팝업이 차단되었습니다. 팝업 차단 설정을 확인해주세요.");
            // }
        }else if(socialLogin === 'kakao'){
            const Rest_api_key='d9bf43790e90d7bcc6346f782fe0f8c3' //REST API KEY
            const redirect_uri = 'http://localhost:3000/kakaoLogin' //Redirect URI
            const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`

            window.location.href = kakaoURL;

            // const popup = window.open(kakaoURL, "kakaoLogin", "width=600,height=400,top=300,left=600");
            // if (!popup || popup.closed || typeof popup.closed == 'undefined') {
            //     alert("팝업이 차단되었습니다. 팝업 차단 설정을 확인해주세요.");
            // }
        }
    }

    // 부모 창에서 메시지 수신
    window.addEventListener("message", (event) => {
    // 필요한 경우 origin 확인
    if (event.origin !== "http://localhost:3000") return;

    const { action } = event.data;
    if (action === "refresh") {
        // 원하는 동작 수행 (새로고침 또는 리다이렉트)
        // window.location.reload(); // 새로고침
        // 또는
        window.location.href = "/"; // 리다이렉트
    }
    });

    const handleFindPw = (e) => {
        nav('/findPw');
    }

    return (
        <Container>
            <InputArea>
                <RegisterDiv>
                    <h2 style={{marginBottom : '0'}}>환영합니다!</h2>
                    <p style={{color : 'silver' , fontSize : '15px' , margin : 'none'}}>방문해주셔서 감사합니다!</p>
                    <UserInputSection>
                        <p>이메일 <RedStarSpan id='passwordCheck'>*</RedStarSpan> <RedStarSpan id='emailFail1' style={{display : 'none', marginRight : '360px'}}> - 이메일을 입력해주세요.</RedStarSpan>
                        <RedStarSpan id='emailFail2' style={{display : 'none', marginRight : '160px'}}> - 유효하지 않은 이메일 또는 비밀번호 입니다.</RedStarSpan></p>
                        <input type="text" name='username' value={user.username} placeholder='이메일을 입력해주세요' onChange={handleInputChange} onKeyDown={(e) => {if(e.key === 'Enter'){document.querySelector('input[name="password"]').focus()}}}/>
                    </UserInputSection>
                    <UserInputSection>
                        <p>비밀번호 <RedStarSpan id='passwordCheck'>*</RedStarSpan> <RedStarSpan id='passwordFail1' style={{display : 'none', marginRight : '118px'}}> - 비밀번호를 입력해주세요. ( 최소 4글자 )</RedStarSpan>
                        <RedStarSpan id='passwordFail2' style={{display : 'none', marginRight : '118px'}}> - 유효하지 않은 이메일 또는 비밀번호 입니다.</RedStarSpan></p>
                        <input type="password" name='password' value={user.password} placeholder='비밀번호를 입력해주세요' onChange={handleInputChange} onKeyDown={(e) => {if(e.key === 'Enter'){handleLoginBtn()}}}/>
                    </UserInputSection>
                    <BtnDiv>
                        <BtnSection>
                            <button className='gradient-box' type="button" onClick={handleLoginBtn}>로그인</button>
                        </BtnSection>
                        <LinkSection>
                            <span style={{color : 'silver'}}>계정이 필요하신가요?</span> <Link to={'/register'}> 가입하기</Link>
                            <span style={{marginLeft : '50px', color : '#007AFF', cursor : 'pointer'}} onClick={handleFindPw}> 비밀번호를 잊으셨나요? </span>
                        </LinkSection>
                    </BtnDiv>
                </RegisterDiv>
                <SocialDiv>
                    <h2 style={{marginBottom : '0'}}>소셜 로그인</h2>
                    <p style={{marginTop : '0', color : 'silver', fontSize : '15px', marginBottom : '60px'}}>아래 버튼으로 간단하게 로그인하세요!</p>
                    <Divider></Divider>
                    <SocialLogin style={{backgroundColor : 'white', color : '#555', border : '1px solid #ddd'}} className='google' name='google' onClick={handleSocialLogin}>
                        <img src='../../../images/googleIcon.png' alt='googleIcon' style={{marginRight : '50px'}}/>
                        구글 로그인
                    </SocialLogin>
                    <SocialLogin style={{backgroundColor : '#1ec800', color : 'white'}} className='naver' name='naver'>
                        <img src='../../../images/naverIcon.png' alt='googleIcon'/>
                        네이버 로그인</SocialLogin>
                    <SocialLogin style={{backgroundColor : '#FEE500', color : '#3c1e1e'}} className='kakao' name='kakao' onClick={handleSocialLogin}>
                        <img src='../../../images/kakaoIcon.png' alt='googleIcon'/>
                        카카오 로그인</SocialLogin>
                </SocialDiv>
            </InputArea>
        </Container>
    );
}

export default Login;