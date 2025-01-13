import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from 'styled-components';
import { fetchTopResult } from '../../services/youtubeApi'; // YouTube API 호출 함수
import NinoBotConfig from './NinoBotConfig';




const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 270px;
  margin: 0 auto;
  background-color: #000;
  color: #fff;
  border-radius: 10px;
`;

const BotArea = styled.div`
  position: relative;
  height: 110px;
  background-color: white;
  //background-image: url('/images/shg/NinoBotBG.jpg');
  border-radius: 10px 10px 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent; 
  display: flex;
  justify-content: center;
  align-items: center; 
`;

const BotIcon = styled.div`
  position: absolute;
  top: 57px;
  left: 25%;
  transform: translateX(-50%);
  background-color: black;  
  background-image: url('/images/shg/ninopla.jpg');
  background-size: 100%;
  background-position: 55% center;
  border-radius: 50%;
  width: 83px;
  height: 83px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  border : 5px solid black;
`;

const InfoArea = styled.div`
  padding : 3px;
`;
const NameDiv = styled.div`
  font-size: 18px;
  margin: 60px 5px 5px 10px;
  font-weight: bold;
  color : white;
`;
const InfoTextDiv = styled.div`
  font-size: 15px;
  margin: 6px 1px 5px 10px;
  //color : grey;
`;

const MusicArea = styled.div`
    width: 93%;
    margin: 8px;
    padding: 1px;
    display: flex;
    justify-content: left;
    align-items: center;
    background-color: #1b1d1e;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 3px;
    margin-bottom: 10px;

  
  label {
    margin-left: 15px;
    font-size : 14px;
    }
    
    input {

    padding: 5px;    
    border-radius: 5px;
    border: none;
    background-color:#1b1d1e;
    color : white;
    text-align : left;
   
  }
`;
////

// 애니메이션 정의
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 스타일 컴포넌트 생성
const GradientText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  background: linear-gradient(270deg, #ff0000, #00ff00, #0000ff, #ff0000);
  background-size: 400% 400%;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ${gradientAnimation} 3s ease infinite;
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
  font-size: 11px;
  font-weight: bold;
`;

const NinoBot = ({ setCurrentVideo, setCurrentBotModal }) => {


  const [searchTerm, setSearchTerm] = useState('');

  //const navigate = useNavigate();

  //const handleInputChange = (e) => setUrl(e.target.value);



  const handleSearch = async () => {
    try {
      const topResult = await fetchTopResult(searchTerm);
      if (topResult) {
        // onSearchComplete(topResult); // 최상단 결과 전달
        console.warn(topResult);
        setCurrentVideo(topResult);
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      console.error('Error fetching top result:', error);
    }
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      e.target.value = '';
      setSearchTerm('');
    }
  }



  return (

    <Container>
      <BotArea>
        <ProfileIcon>
          <img src={"//192.168.0.140/uploadImg/4d463fa0-af85-4bf4-80bd-4c5559f231e2_free-icon-settings-3171061.png"}
            alt="설정"
            style={{
              width: '20px',
              height: '20px',
              marginRight: '7px',
              backgroundColor: 'transparent',
              marginTop: '10px',
              cursor: 'pointer'
            }}
            onClick={() => { setCurrentBotModal("NinoBotConfig") }}>
          </img>

        </ProfileIcon>
        <BotIcon>

        </BotIcon>
      </BotArea>
      <InfoArea>

        <NameDiv>NINO BOT
        <IconWrapper>
          <IconText>BOT</IconText>
        </IconWrapper>
        </NameDiv>
        <InfoTextDiv> 금지어 설정 가능.</InfoTextDiv>
        <InfoTextDiv> 자동 경고 및 강퇴 설정 가능.</InfoTextDiv>
        <InfoTextDiv> 음악 재생 가능</InfoTextDiv>
        <InfoTextDiv> 문의는 문의게시판을 참고해주세요</InfoTextDiv>
        <br/>
        {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <GradientText> Hello, I am Nino!</GradientText>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <GradientText> Hello, I am Nino!</GradientText>
        </div>  */}
        {/* 힝 */}
        <MusicArea>
          <label htmlFor="music-input" > 
          <img style={{width : "33px"}} src="\images\icons8-youtube123.svg" alt=''/>

          </label>
          <input
            type="text"
            value={searchTerm}
            onKeyDown={(e) => activeEnter(e)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Music Search"
          />
          <button onClick={handleSearch} style={{ display: "none" }}>재생</button>
        </MusicArea>
      </InfoArea>

    </Container>
  );
};



export default NinoBot;