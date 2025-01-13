import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function fetchGoogleUserInfo(accessToken, setLoginStatus) {
  fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then(response2 => response2.json())
  .then(data => {
      // 받은 사용자 정보를 React 앱 상태에 저장하거나 처리
      axios.get('/test/api/emailCheck?email=' + data.email)
          .then(response => {
              if(!response.data){
                  if(window.confirm('존재하지 않는 이메일 입니다. 구글 정보로 회원가입 하시겠습니까?')){
                      const registerUser = {
                          userEmail : data.email,
                          userPassword : 'dixcord1234',
                          userName : data.name,
                          userNickName : '(미입력)',
                          userIcon : '(미입력)',
                          userPhone : '(미입력)',
                          userBirthday : '2024-12-13',
                          interest : []
                      }
                      axios.post('/user/api/register', registerUser)
                          .then(result => {
                              // console.log(result.data);
                                // 팝업 창 닫기
                                // window.close();
                                window.location.href = '/'
                          })
                          .catch(erer =>   // 팝업 창 닫기
                            // window.close());
                            window.location.href = '/');
                  }else {
                      window.location.hash = '';
                  }
              }else {
                  // 로그인 시켜주기
                  const user = {
                      username : response.data.userEmail,
                      password : 'dixcord1234'
                  }
                  axios.post('/test/api/login', user)
                  .then(() => {
                      setLoginStatus(true);
                      // 팝업 창 닫기
                    //   window.close();
                    window.location.href = '/'
                  }).catch(err => {alert('로그인 시켜주기 에러!');window.close();});
              }
          })
          .catch(err => {alert('이메일 체크 에러!');window.close();});
      
  })
  .catch(error => {
        // 팝업 창 닫기
//   window.close();
window.location.href = '/'
  });
}

function GoogleAuthRedirect({setLoginStatus}) {
  // 부모 창에 메시지 전달
//   window.opener.postMessage({ action: "refresh" }, "*");

  // 구글 로그인 정보 조회
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');

  if (accessToken) {
      // 액세스 토큰을 통해 사용자 정보 요청
      fetchGoogleUserInfo(accessToken, setLoginStatus);
  }

  return <div />;
}


export default GoogleAuthRedirect;