import axios from 'axios';
import React from 'react';
import KakaoLogin from 'react-kakao-login';
import { useNavigate } from 'react-router-dom';

function KakaoAuthRedirect(props) {

    const nav = useNavigate();

    const code = new URL(window.location.href).searchParams.get("code");

    axios.post('https://kauth.kakao.com/oauth/token', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
            grant_type: 'authorization_code',
            client_id: 'd9bf43790e90d7bcc6346f782fe0f8c3', // 카카오 REST API 키
            redirect_uri: 'http://localhost:3000/kakaoLogin',   // 리다이렉트 URI
            code: code,                         // 얻은 Authorization Code
        },
    })
    .then(response => {
        const accessToken = response.data.access_token;

        // Access Token을 이용해 사용자 정보 가져오기
        return axios.post('https://kapi.kakao.com/v2/user/me', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    })
    .then(response => {
        const userInfo = response.data;

        if(userInfo){
            axios.get('/test/api/emailCheck?email=' + userInfo.kakao_account.email)
                .then(result => {
                    if(result.data !== null){
                        // 이메일 정보가 있을 때
                        if(result.data.kakaoId === null || result.data.kakaoId === 0 || result.data.kakaoId === undefined){
                            // Dixcord 계정이 있으며 카카오 로그인은 처음함
                            if(window.confirm('이미 계정이 있습니다. 연동하시겠습니까?')){
                                // 계정 연동 ( 고유ID 저장 후 로그인 시켜주기 )
                                axios.post('/user/api/updateKakaoId', {userCode : result.data.userCode , kakaoId : result.data.kakaoId})
                                    .then(updateKakao => {
                                        if(updateKakao === 'success'){
                                            // 로그인 시키는 함수 실행 후 메인 화면 이동
                                            axios.post('/test/api/kakao/login', userInfo.id)
                                            .then(kakaoLogin => {
                                                window.location.href = '/'
                                            })
                                            .catch(kakaologinerr => console.log(kakaologinerr));
                                        }else {
                                            return nav('/login');
                                        }
                                    })
                                    .catch(updateKakaoErr => console.log(updateKakaoErr));
                            }else {
                                // 안하기
                                document.cookie.split(';').forEach(cookie => {
                                    const [name] = cookie.split('=');
                                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                                });
                                return nav('/login');
                            }
                        }else {
                            // 계정이 있으며 이미 연동 한 경우
                            if(Number(result.data.kakaoId) === Number(userInfo.id)){
                                // 저장된 고유ID와 카카오 고유 ID가 일치 ( 로그인 시켜주기 )
                                axios.post('/test/api/kakao/login', userInfo.id)
                                    .then(kakaoLogin => {
                                        window.location.href = '/'
                                    })
                                    .catch(kakaologinerr => console.log(kakaologinerr));
                            }else {
                                // 저장된 고유ID와 카카오 고유 ID가 불일치
                                alert('다른 카카오 계정과 연동되어 있습니다.');
                                // 쿠키 정보 삭제
                                document.cookie.split(';').forEach(cookie => {
                                    const [name] = cookie.split('=');
                                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                                });
                                return nav('/login');
                            }
                        }
                    }else {
                        // 이메일 정보가 없을 때
                        if(window.confirm('계정이 존재하지 않습니다. 카카오 이메일 주소로 가입하시겠습니까?')){
                            // 카카오 이메일 주소로 가입시켜주기'

                        }else {
                            // 쿠키 정보 삭제
                            document.cookie.split(';').forEach(cookie => {
                                const [name] = cookie.split('=');
                                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                            });
                            return nav('/login');
                        }
                    }
                })
                .catch(error => console.log(error));
        }
    })
    .catch(err => console.error('에러:', err));


    return (
        <div>
            <h1>카카오리다이렉트</h1>
        </div>
    );
}

export default KakaoAuthRedirect;