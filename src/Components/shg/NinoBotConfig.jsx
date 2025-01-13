import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Switch from './Switch.jsx';
import BWButton from './BWButton.jsx';

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 300px;
  //margin: 0 auto;
  text-align: left;
  background-color: #000;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
`;
const TitleDiv =styled.div`
 display: flex; 
  justify-content: space-between; /* 제목 왼쪽, 버튼 오른쪽 */
  align-items: center; 
  padding: 2px ; /* 위아래 여백 */
  //border-bottom: 1px solid #ccc;
`;

const TitleArea = styled.div`  
  margin: 1px 0;
  color: #7289da;
  //font-weight: bold;
`;

const BanwordArea = styled.div`
  margin: 5px;
  display: flex;
  justify-content: left;
  align-items: left;
  background-color: black;
  border-radius: 5px;

  label {
   // margin-right: 10px;
   margin-left : -1px;
  }

  input {
    padding: 5px;
    border-radius: 5px;
    border: none;
    background-color: #fff;
    color: black;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;  

  &:hover {
    background-color: #0056b3;
  }
`;
const ExitButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  padding: 5px 10px 5px 10px;
  border-radius: 500000px;
  cursor: pointer;
  margin-top: 1px;
  left : 500px;

  &:hover {
    
  }
`;
const OnOffArea = styled.div`
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 10px;
`;

const OOTitle = styled.div`  
  margin-bottom: 5px;
  font-weight: bold;
  left : 900px;
`;

const OODiv = styled.ul`
  padding : 2px;
  list-style: none;
  padding: 2px;
  text-align: left;
`;

const OOSection = styled.li`
  margin: 10px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BanwordDiv = styled.div`
  width : 100%;
  font-family: Arial, sans-serif; 
  font-size: 13px; 

  input {
  width : 270px;
  padding : 10px;
  margin-bottom : 5px;
  font-size : 13px;
  border-radius : 5px;
  background-color: #333;
  color: #eee;
}
`;

const BanwordLabel = styled.label`
  display : block;
  margin-bottm : 10px;
  padding : 3px;
  margin-top : 5px;
  font-weight : bold;
  color: #7289da;
`;

const BanwordInput = styled.input`
  width : 270px;
  padding : 10px;
  margin-bottom : 5px;
  font-size : 13px;
  border-radius : 5px;
  background-color: #333;
  color: white;
`;

  const ButtonDiv = styled.div`
    width : 100%;
  `;

const NinoBotConfig = ({isBotModalOpen,data, setMusicPlay, setWarnNkick, roomNumber, setCurrentBotModal, banWordList, setBanWordList,setChatbanstatus  }) => {    

  const [banWord, setBanWord] = useState("");
  const [BWcheckbox, setBWCheckbox] = useState(true);
  const [WKcheckbox, setWKCheckbox] = useState(true);
  const [MPcheckbox, setMPCheckbox] = useState(true);
    
  useEffect(() => {

    const fetchBanWords = async () => {
      axios.get('/api/bot/banWordList', {
        params: { roomnumber: roomNumber }
      })
      .then(response => {
        console.log("밴리스트 : ", response.data);
        setBanWordList(response.data);
        makeButton();
      });
    };
    fetchBanWords();
    
  }, []);
  
  useEffect(() =>{
    
    const fetchRoomStatus = async () =>{
      
      const resp = await axios.get('/api/bot/roomStatus',{
        params : {roomnumber : roomNumber}
      });
      setBWCheckbox(resp.data.bwstatus);
      setWKCheckbox(resp.data.wkstatus);
      setMPCheckbox(resp.data.mpstatus);

      // setChatbanstatus(resp.data.bwstatus);
      setWarnNkick(resp.data.wkstatus);
      setMusicPlay(resp.data.mpstatus);

    }
    fetchRoomStatus();     
  },[isBotModalOpen])
    
  const inputHandle = (e) =>{
    setBanWord(e.target.value);        
  }   

    const DeleteBanword = (word) => {
      axios
        .post(
          '/api/bot/deleteBanword',
          {
            banword: word,
            roomnumber: roomNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(() => {
          const fetchBanWords = async () => {
            const resp = await axios.get('/api/bot/banWordList', {
              params: { roomnumber: roomNumber },
            });
            setBanWordList(resp.data);
          };
          fetchBanWords();
        })
        .catch((error) => {
          console.error('Error deleting banword:', error);
        });
    };
   
    const makeButton = () => {
      return banWordList.map((word, index) => (
        <BWButton
          key={index}
          text={word}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          }
          onClick={() => DeleteBanword(word)}
        />
      ));
    };
    
    
    const activeEnter = (e) => {
      if(e.key === "Enter") {
        activeButton();
        e.target.value='';
      }
    }

    const activeButton = () => {
      console.log(banWord);
      if(!banWord || banWord.trim() ===''){
        return alert('금지어를 입력해 주세요');
      }
      if(banWord.length>5){
        return alert('금지어는 5자 이하로 입력해 주세요');
      }
        const checkBanWord = banWordList.includes(banWord);
        if (checkBanWord) {
          return alert('이미 등록된 금지어입니다.');          
        }
        const resp = axios.post('/api/bot/banword', {
            banword: banWord,
            roomnumber: roomNumber
              }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
          console.log(response.data);
          const fetchBanWords = async () => {
            const respre = await axios.get('/api/bot/banWordList', {
              params: { roomnumber: roomNumber }
            });
            makeButton();
          setBanWordList(respre.data);
        };    
        fetchBanWords().then(() => makeButton());          
        }).catch();
    };

    const HelpMe = () =>{  
      axios.post('/api/bot/helpMe',{
        roomnumber : data.userCode * 2070,
        userCode : data.userCode,
      }).then(response => {
        console.log('전송완료');
      }).catch(error => {
        console.error('요청 실패:', error.response?.data || error.message);
      });
    }; 

    const  goBot = () =>{
      setCurrentBotModal("NinoBot");
    };

    const updateStatus = async (statusType, newValue) =>{
      try{
        await axios.post('/api/bot/updateStatus', {
          roomnumber : roomNumber,
          statusType : statusType,
          value: newValue ? 1 : 0, // Boolean을 int로 변환
        },{
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.warn(statusType);
        console.warn(newValue);

      } catch(error){
        console.error(`Failed to update ${statusType} in DB:`, error);
      }
    };

    return (
        <Container>
          <TitleDiv>
           <TitleArea> Nino Bot Config </TitleArea>            
           <ExitButton onClick={goBot}>X</ExitButton>
          </TitleDiv>
          <OnOffArea>
            <OODiv style={{marginBottom : "1px", marginTop : "1px"}}>
              <OOSection>
                Chatting Fitter 
                <Switch 
                  checked={BWcheckbox} 
                  onChange={(newChecked) => {
                    setBWCheckbox(newChecked);
                    setChatbanstatus(newChecked);
                    updateStatus('BWstatus',newChecked);
                  }}
                  />
              </OOSection>
              <OOSection>
                Auto Kick <Switch 
                  checked={WKcheckbox} 
                  onChange={(newChecked) => {
                    setWKCheckbox(newChecked);
                    setWarnNkick(newChecked);
                    updateStatus('WKstatus',newChecked);
                  }}
                  />
              </OOSection>
              <OOSection>
                Music Player <Switch 
                  checked={MPcheckbox} 
                  onChange={(newChecked) => {
                    setMPCheckbox(newChecked);
                    setMusicPlay(newChecked);
                    updateStatus('MPstatus',newChecked);
                  }}
                />
              </OOSection>
              <OOSection>
                Help <SubmitButton onClick= {HelpMe}> Me</SubmitButton>
              </OOSection>
            </OODiv>
          </OnOffArea>
            <BanwordArea> 
              <BanwordDiv>
                <BanwordLabel>Add Banword </BanwordLabel>
                <BanwordInput type="text" onKeyDown={(e) => activeEnter(e)} onChange={inputHandle} name="banwordInput" placeholder='Press Enter Key'></BanwordInput>
                <button onClick ={activeButton} style={{ display:"none"}}/>      
              </BanwordDiv>
            </BanwordArea>
            <ButtonDiv>
              {banWordList.length > 0 ? makeButton() : <p>No ban words added.</p>}
            </ButtonDiv>
        </Container>
    );
};

export default NinoBotConfig;


