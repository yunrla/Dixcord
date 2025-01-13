import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';






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
    padding: 20px;
    color: #e0e0e0;
`;

const Container = styled.div`
text-align: center;
border-radius: 1%;
height:700px ;
width: 1000px;
padding: 35px 0px;
position: relative;
background-color: rgba(42, 42, 42, 0.8); 
z-index: 1000;
box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
border: 2px solid rgba(255, 255, 255, 0.2);        
overflow-y: scroll;
`
const Header = styled.div`
 p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }
`
const H1 = styled.h1`
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

`
const P = styled.p`
    margin: 0;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 1rem;
    color: #fff;
    background-color: rgba(42, 42, 42, 0.8);
    
`
const Body = styled.div`    
    padding: 10px;
    
  

`

const UploadResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: relative;
  .dimmed {
    background-color: rgba(0, 0, 0, 0.4); /* 반투명 검정색 배경 */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    cursor: pointer;
}
.dimmed-text {
    color: white; /* 텍스트 색상 */
    font-size: 16px; /* 텍스트 크기 */
    text-align: center; /* 텍스트 가운데 정렬 */
    margin-top: 60px;
    cursor: pointer;
  }

`;

const Img = styled.img`
    width: 90%; /* 부모 요소의 너비를 꽉 채움 */
    height: 90%; /* 부모 요소의 높이를 꽉 채움 */
    object-fit: cover; /* 이미지가 영역을 꽉 채우도록 하되, 비율은 유지 */
    border-radius: 50%;
    border: 1px solid #aaa;
    cursor: pointer;
`


const Div2 = styled.div`

    display: flex;
    margin: 0;
    justify-content: center;
    `
const Div3 = styled.div`
   
 p {
        line-height: 1.4; 
    }



padding-left: 50px;

`
const Button = styled.button`
  background-color: rgba(248, 244, 244, 0.1);
    color:#01CD9A;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {
        transform: scale(1.05);
    }
`

const Footer = styled.footer`

`
const Span = styled.span`
        color: #aaa;
	    font-size: 28px;
	    font-weight: bold;
	    cursor: pointer;
        transition: color 0.3s ease;
        position: absolute; 
        top: 20px; 
        right: 20px;
    `




const Input = styled.input`
    color:aliceblue;
    height: 30px;
    border: 1px solid #ada9a9;
    padding: 15px 10px;
    margin: 3px 15px;
    background-color: rgba(42, 42, 42, 0.4); 
`

const TitleInput = styled(Input)`

`

const NumberInput = styled(Input)`
    height: 25px;


    &::placeholder {
        font-size: 16px; /* 원하는 크기로 변경 */
        color: #888; /* 색상도 변경 가능 */
    }
    

`

const Section = styled.section`
    display: flex;
    margin: 5px;
    
    p{
        width: 150px;
        margin-top: 25px;
    }
    input{
        width: 340px;
    }
`

const HiddenInput = styled.input`
display: none;
   
`




const ImgDiv = styled.div`
    display: flex;
    flex-direction:row;
    justify-content: center;
    gap:100px;
`

const ImgGroup = styled.div`
      display: flex;
      flex-direction: column; 
      align-items:center;


`

const ButtonGroup = styled.div`
      display: flex;

`

const BodyInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 150px;
    margin-top: 20px;
`

const SpanDelete = styled.span`
color: #ff4747; /* 빨간색으로 변경 */
  font-size: 30px; /* 크기를 키움 */
  font-weight: bold; /* 글씨 굵게 */
  cursor: pointer; /* 클릭 가능 표시 */
  transition: transform 0.2s ease, color 0.3s ease; /* 부드러운 변환 효과 */
  position: absolute; /* 절대 위치 설정 */
  top: -15px; /* 상단에서 10px */
  right: 0px; /* 우측에서 10px */
  
  &:hover {
    color: #ff1a1a; /* 호버 시 색상 변환 */
    transform: scale(1.1); /* 클릭 시 살짝 커짐 */
  }

  &:active {
    transform: scale(0.95); /* 클릭할 때 살짝 줄어드는 효과 */
  }
`
const SpanDelete2 = styled.span`
color: #ff4747; /* 빨간색으로 변경 */
  font-size: 30px; /* 크기를 키움 */
  font-weight: bold; /* 글씨 굵게 */
  cursor: pointer; /* 클릭 가능 표시 */
  transition: transform 0.2s ease, color 0.3s ease; /* 부드러운 변환 효과 */
  position: absolute; /* 절대 위치 설정 */
  top: -15px; /* 상단에서 10px */
  right: 0px; /* 우측에서 10px */
  
  &:hover {
    color: #ff1a1a; /* 호버 시 색상 변환 */
    transform: scale(1.1); /* 클릭 시 살짝 커짐 */
  }

  &:active {
    transform: scale(0.95); /* 클릭할 때 살짝 줄어드는 효과 */
  }
`

const Select = styled.select`
    color:white;
    height: 60px;
    border: 1px solid #ada9a9;
    margin: 3px 15px;
    background-color: rgba(42, 42, 42, 0.4);
    width: 360px;
    padding-left: 3px;
     
    p{
        width: 150px;
    }
;
    
`


const FileP = styled.p`
    font-size: 20px;
    margin-left: -60px;
    padding-top: 11px;
`



const Option = styled.option`
    
`

const DropdownBox = styled.div`
  position: relative;
  width: 362px;
  margin: 3px 15px;
`;

const SelectedItem = styled.div`
  color: white;
  height: 60px;
  border: 1px solid #ada9a9;
  background-color: rgba(42, 42, 42, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  cursor: pointer;
`;

const DropdownList = styled.div`
  border: 1px solid #aaa;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: #232428;
  z-index: 999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #6e6868;
  }
`;






function SettingsRoom({ data, activeRoom, setActiveRoom, settingRoom, setSettingRoom }) {

    // 이미지 미리보기
    const [imageIcon, setImageIcon] = useState("http://192.168.0.140/uploadImg/logo.png");
    // UUID로 저장할 이미지 파일명
    // UUID로 저장할 이미지 파일명
    //배경 이미지 미리보기
    const [imageBackground, setImageBackground] = useState("http://192.168.0.140/uploadImg/logo.png");
    //방 정보 가져오기
    //방 멤버 가져오기
    const [member, setMember] = useState([]);
    //카테고리
    //환영메시지
    //방 번호
    //방장 넘기기 토글 열기
    const [isOpen, setIsOpen] = useState(false);
    //넘길 방장 선택하기
    const [selectedLeader ,setSelectedLeader] = useState(null);
    //유저 닉네임 가져오기
    const [userNickName, setUserNickName] = useState([]);
    //방장 넘길 userCode

    const [settingSave, setSettingSave] = useState({
        roomNumber : 0,
        roomIcon : '\\192.168.0.140/uploadImg/logo.png',
        roomBgImg : '\\192.168.0.140/uploadImg/logo.png',
        roomTitle : data.userName + '님의 방',
        roomCategory : '',
        welcomeMessage : '',
        userCode : ''
    });




    const toggleDropdown = () => setIsOpen((prev) => !prev);





    const inputRef = useRef(null);





    const handleModalClose = () => {
        setSettingRoom(false);


    }



    const handleTitle = (e) => {

        setSettingSave(prev => ({
            ...prev,
            roomTitle : e.target.value
        }));
    }


    //파일 확장자 체크
    const regex = new RegExp("(.*?)\.(exe|sh|zip|alz)$");

    function checkExtension(fileName, fileSize) {

        const MAX_SIZE = fileSize * 1024 * 1024;

        if (fileSize >= MAX_SIZE) {
            alert("파일 사이즈 초과");
            return false;
        }
        if (regex.test(fileName)) {
            alert("해당 종류의 파일은 업로드 할 수 없습니다.");
            return false;
        }
        return true;
    }


    //파일 업로드
    const handleUpload = async (e) => {
        const file1 = e.target.files[0];

        if (!file1) {
            alert("파일을 선택하세요");
            return;
        }


        const formData = new FormData();
        formData.append("uploadFile", file1);

        try {
            const response = await axios.post('/api/room/uploadFile', formData)

            setSettingSave(prev => ({
                ...prev,
                roomIcon : "\\192.168.0.140/uploadImg/creator/" + response.data
            }));
        } catch (err) {
            console.error("File upload failed:", err);
        }

        if (file1 && checkExtension(file1.name, file1.size)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageIcon(event.target.result);
            };
            reader.readAsDataURL(file1);
        }
    }

    //파일 업로드2
    const handleUpload2 = async (e) => {
        const file2 = e.target.files[0];

        if (!file2) {
            alert("파일을 선택하세요");
            return;
        }


        const formData = new FormData();
        formData.append("uploadFile2", file2);

        try {
            const response = await axios.post('/api/room/uploadFile2', formData)

            setSettingSave(prev => ({
                ...prev,
                roomBgImg : "\\192.168.0.140/uploadImg/backgroundImg/" + response.data
            }));
        } catch (err) {
            console.error("File upload failed:", err);
        }

        if (file2 && checkExtension(file2.name, file2.size)) {
            const reader2 = new FileReader();
            reader2.onload = (event) => {
                setImageBackground(event.target.result);
            };
            reader2.readAsDataURL(file2);
        }
    }






    //아이콘 이미지 삭제
    const handleDelete = () => {

        // 이미지 관련 상태 초기화
        setImageIcon("http://192.168.0.140/uploadImg/logo.png");
        setSettingSave(prev => ({
            ...prev,
            roomIcon : "http://192.168.0.140/uploadImg/logo.png"
            }));

        const formData = new FormData();
        formData.delete("uploadFile");

        const fileInput = document.querySelector('#fileInput1');
        fileInput.value = "";  // 파일 입력 필드 초기화

    }


    //배경 이미지 삭제
    const handleDelete2 = () => {
        //const uploadDelete = document.querySelector('#uploadImgTwo');
        // uploadDelete.src = "" //기존 이미지 삭제
        // uploadDelete.style.display = "none" //이미지 숨기기

        // 이미지 관련 상태 초기화
        setImageBackground("http://192.168.0.140/uploadImg/logo.png");
        setSettingSave(prev => ({
            ...prev,
            roomBgImg : "http://192.168.0.140/uploadImg/logo.png"
            }));

        const formData = new FormData();
        formData.delete("uploadFile");

        const fileInput = document.querySelector('#fileInput2');
        fileInput.value = "";  // 파일 입력 필드 초기화

    }

    const getSettingData = () => {

        if (!activeRoom) {
            return;
        }

        // 방 설정 데이터
        axios.get(`/api/room/getSettingData/${settingSave.roomNumber}`)
            .then(response => {
                setSettingSave(response.data);

                // 방 멤버 데이터
                axios.get(`/api/room/getSettingMember/${settingSave.roomNumber}`)
                    .then(response => {
                        setMember(response.data);

                        const userCodes = response.data
                            .map(user => user.userCode)
                            .filter(userCode => userCode !== data.userCode);

                        // 방 멤버 닉네임
                        axios.post('/api/room/getUserNickNames', userCodes)
                            .then(response => {
                                setUserNickName(response.data);
                            })
                            .catch(error => {
                                console.error("Error fetching user nicknames:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error fetching room members:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching setting data:", error);
            });
    };


    useEffect(() => {
        // 컴포넌트가 렌더링된 후 커서를 맨 오른쪽으로 이동
        if (inputRef.current) {
            const input = inputRef.current;
            input.focus(); // 포커스를 설정
            input.selectionStart = input.value.length; // 커서를 맨 끝으로 설정
            input.selectionEnd = input.value.length; // 커서를 맨 끝으로 설정
        }
    }, []);

    useEffect( () => {
        if(activeRoom !== null && settingSave.roomNumber === 0){
            setSettingSave(prev => ({
                ...prev,
                roomNumber : Number(activeRoom)
            }));
        }
    }, [activeRoom]);

    useEffect(() => {
        if(settingSave.roomNumber > 0 && settingSave.userCode === ''){
            getSettingData();
        }
    }, [settingSave]);


    const handleIcon = () => {
        document.getElementById('fileInput1').click();
    }

    const handleBackGround = () => {
        document.getElementById('fileInput2').click();

    }




    // useEffect(() => {
    //     if (settingData) {
    //         if (settingData.roomIcon) {
    //             const formattedRoomIcon = settingData.roomIcon.replace(/\\/g, "/");
    //             setImageIcon("/" + formattedRoomIcon);
    //         }
    //         if (settingData.roomBgImg) {
    //             const formattedRoomBgImg = settingData.roomBgImg.replace(/\\/g, "/");
    //             setImageBackground("/" + formattedRoomBgImg);
    //         }
    //         if (settingData.welcomeMessage) {
    //             setWelCome(settingData.welcomeMessage);
    //         }
    //         if (settingData.roomCategory) {
    //             setCategory(settingData.roomCategory);
    //         }
    //         if (settingData.roomNumber) {
    //             setRoomNumber(settingData.roomNumber);
    //         }
    //     }
    // }, [settingData]);


    const handleWelcome = (e) => {

        setSettingSave(prev => ({
            ...prev,
            welcomeMessage : e.target.value
        }));
    }

    const changeCategory = (e) => {
        const value = e.target.value;
        setSettingSave(prev => ({
            ...prev,
            roomCategory : value
        }));
    }

    const handleToggleClick = (e) => {
        setSelectedLeader(e.target.innerHTML);
        const roomUsercode = e.target.getAttribute('data-userCode');
        setSettingSave(prev => ({
            ...prev,
            userCode : Number(roomUsercode)
        }));
        setIsOpen(false);
    }

    const handleSaveChange = () => {


        axios.post('/api/room/settingUpdate', settingSave)
            .then(response => {
                if (response.data === "success") {
                    setActiveRoom(null);
                    setSettingRoom(false);
                }


            })

    }






    return (
        <Wrapper style={settingRoom === true ? { display: 'flex' } : { display: 'none' }}>
            <Container>
                <Header>
                    <Span onClick={handleModalClose}>&times;</Span>
                    <H1>방 설정 변경</H1>
                </Header>
                {settingSave !== null && <Body>
                    <ImgDiv>
                        <ImgGroup>
                            <P>방 아이콘</P>
                            <UploadResult onClick={handleIcon}>
                                {imageIcon !== "http://192.168.0.140/uploadImg/logo.png" && imageIcon !== "//192.168.0.140/uploadImg/logo.png" ?
                                    <SpanDelete onClick={(e) => {
                                        e.stopPropagation(); // 부모의 onClick으로 이벤트 전파되지 않도록 막음
                                        handleDelete();  // handleDelete 실행
                                    }}>&times;</SpanDelete> : null}
                                {imageIcon && <Img id='uploadImgOne' src={settingSave.roomIcon !== null ? '/' + settingSave.roomIcon : imageIcon} alt="Room Icon" />}
                                <div class="dimmed">
                                    <div className="dimmed-text">
                                        수정하기
                                    </div>
                                </div>
                            </UploadResult>
                            <HiddenInput
                                accept='image/*'
                                onChange={handleUpload}
                                name="uploadFile"
                                //multiple="multiple"
                                type='file'
                                id='fileInput1'
                            >
                            </HiddenInput>
                            <ButtonGroup>
                            </ButtonGroup>
                        </ImgGroup>
                        <ImgGroup>
                            <P>방 배경 이미지</P>
                            <UploadResult onClick={handleBackGround}>
                                {imageBackground !== "http://192.168.0.140/uploadImg/logo.png" && imageBackground !== "//192.168.0.140/uploadImg/logo.png" ?
                                    <SpanDelete2 onClick={(e) => {
                                        e.stopPropagation(); // 부모의 onClick으로 이벤트 전파되지 않도록 막음
                                        handleDelete2();  // handleDelete 실행
                                    }}>&times;</SpanDelete2> : null}
                                {imageBackground && <Img id='uploadImgTwo' src={settingSave.roomBgImg !== null ? '/' + settingSave.roomBgImg : imageBackground} alt="Background Image" />}
                                <div class="dimmed">
                                    <div className="dimmed-text">
                                        수정하기
                                    </div>
                                </div>
                            </UploadResult>
                            <ButtonGroup>
                                <HiddenInput
                                    accept='image/*'
                                    onChange={handleUpload2}
                                    name="uploadFile2"
                                    //multiple="multiple"
                                    type='file'
                                    id='fileInput2'
                                >
                                </HiddenInput>
                            </ButtonGroup>
                        </ImgGroup>
                    </ImgDiv>

                    <BodyInput>
                        <Div3>
                            <Section>
                                <p>방 이름</p>
                                <TitleInput id='roomTitle'
                                    type='text'
                                    onChange={handleTitle}
                                    value={settingSave.roomTitle}
                                    placeholder="방 이름을 입력하세요"
                                    ref={inputRef}
                                    spellCheck={false}
                                    autoComplete="off"
                                ></TitleInput>
                            </Section>
                        </Div3>
                        <Div3>
                            <Section>
                                <p>카테고리</p>
                                <Select onChange={changeCategory} value={settingSave.roomCategory} defaultValue="카테고리를 선택하세요" >
                                    <Option value="게임">게임</Option>
                                    <Option value="음악">음악</Option>
                                    <Option value="프로젝트">프로젝트</Option>
                                    <Option value="교육">교육</Option>
                                    <Option value="엔터테인먼트">엔터테인먼트</Option>
                                    <Option value="음식">음식</Option>
                                    <Option value="여행">여행</Option>
                                    <Option value="경제제">경제제</Option>
                                </Select>
                            </Section>
                        </Div3>
                        <Div3>
                            <Section>
                                <p>환영 메시지</p>
                                <Input id='welcomeMessage'
                                    type='text'
                                    onChange={handleWelcome}
                                    value={`${settingSave.welcomeMessage}`}
                                    placeholder="환영 메시지를 입력하세요"
                                ></Input>
                            </Section>
                        </Div3>
                        <Div3>
                            <Section>
                                <p>방장 넘기기</p>
                                <DropdownBox>
                               
                                    {userNickName.length === 0 ?
                                        <SelectedItem >{"참여자가 존재하지 않습니다."}</SelectedItem>
                                        :
                                        <SelectedItem onClick={toggleDropdown}>
                                            
                                            {selectedLeader === null ? "유저를 선택하세요.": selectedLeader}
                                            
                                        </SelectedItem>}
                                    
                                    <DropdownList isOpen={isOpen}>
                                        {userNickName.length > 0 &&
                                            userNickName.map((user,index) => {
                                                return (
                                                    <DropdownItem key={index} data-userCode={user.userCode} onClick={handleToggleClick}>
                                                        {user.userNickName}
                                                    </DropdownItem>
                                                );
                                            })
                                        }
                                    </DropdownList>
                                </DropdownBox>

                            </Section>
                        </Div3>
                    </BodyInput>
                </Body>}
                <Footer>
                    <Div2>
                        <Button onClick={handleSaveChange}>설정 저장</Button>
                    </Div2>
                </Footer>

            </Container>
        </Wrapper>
    );
}
export default SettingsRoom;