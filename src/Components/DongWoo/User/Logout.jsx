import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

function Logout({ status , getUser , ws}) {
    const nav = useNavigate();

    // useEffect( () => {
    //   if(getUser !== null){
    //     axios.get('/user/api/loginStateOff?userCode=' + getUser.userCode)
    //       .then(response => {
    //         if(response.data === 'success'){
    //           if(ws !== null){
    //               const timestamp = Date.now();
    //               const formattedMessage = JSON.stringify({
    //                   action: "userLogin",
    //                   userCode: getUser.userCode,
    //                   textChatNo : Number(0),
    //                   userNickName: 'hihi',
    //                   message: 'tete',
    //                   date: timestamp,
    //                   userIcon: 'asd',
    //               });
    //               ws.send(formattedMessage);
    //               }
    //           ws.onclose();
    //           return;
    //         }else {
    //           return;
    //         }
    //       })
    //       .catch(err => console.error(err));
    //   }
    // }, [getUser]);
    
    const TOKEN = localStorage.getItem('token');
    // 카카오 로그아웃
    const snsLogout = async () => {
        try {
          await axios.post(
            'https://kapi.kakao.com/v1/user/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );
          localStorage.removeItem('token');
          status(false);
          window.location.reload(true);
        } catch (error) {
          // console.error('카카오 로그아웃 실패', error);
        }
      };
    
      const logoutHandler = async () => {
        try {
            // 서버 로그아웃 요청
            await axios.post('/test/api/logout');

            // Google 로그아웃
            const iframe = document.createElement("iframe");
            iframe.src = "https://accounts.google.com/logout";
            iframe.style.display = "none"; // iframe을 숨김
            document.body.appendChild(iframe);

            await new Promise((resolve) => {
                iframe.onload = resolve; // iframe이 로드될 때까지 기다림
            });

            // 카카오 로그인 정보가 있을 때
            if(TOKEN !== null){
                // 카카오 관련 쿠키 삭제
                snsLogout();
            }


            // 쿠키 삭제
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=');
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });

            if(getUser !== null){
              await axios.get('/user/api/loginStateOff?userCode=' + getUser.userCode)
                .then(response => {
                  if(response.data === 'success'){
                    if(ws !== null){
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
                    ws.onclose();
                  }
                })
            }

            // 토큰 삭제
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            // 페이지 이동 전에 상태 변경
            status(false);
            window.location.reload(true);
            // 페이지 이동
            // nav('/'); // react-router-dom을 사용하여 이동
        } catch (error) {
            // console.error("로그아웃 처리 중 오류가 발생했습니다:", error);
        }
    };

    useEffect(() => {
        logoutHandler();
    }, []);

    return <div></div>;
}

export default Logout;
