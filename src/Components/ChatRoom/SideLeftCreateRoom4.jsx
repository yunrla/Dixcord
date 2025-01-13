import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Alert from '../Alert/Alert';
import Confirm from '../Alert/Confirm';

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
padding:30px;
width: 600px;
position: relative;
background-color: rgba(42, 42, 42, 0.8); 
z-index: 1000;
box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
border: 2px solid rgba(255, 255, 255, 0.2);        

`
const Header = styled.div`
 p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }
`
const H1 = styled.h1`

`
const Body = styled.div`
padding: 10px;
`
const Div = styled.div`
  p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }

`
const UploadResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;

`;

const Img = styled.img`
    width: 90%; /* 부모 요소의 너비를 꽉 채움 */
    height: 90%; /* 부모 요소의 높이를 꽉 채움 */
    object-fit: cover; /* 이미지가 영역을 꽉 채우도록 하되, 비율은 유지 */
    border-radius: 50%;
    border: 1px solid #aaa;
`


const Div1 = styled.div`
display: flex;
    margin: 10px;
    gap: 30px;
    justify-content: center;
    
`
const Div2 = styled.div`

    display: flex;
    margin: 10px;
    gap: 30px;
    justify-content: center;
    `
const Div3 = styled.div`
 p {
        margin-top: 35px; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
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
        position: absolute; /* 절대 위치로 설정 */
        top: 5px; /* 상단에서 10px */
        right: 10px;
    `


const ImageBtn = styled.button`
    margin-top: 25px;
    font-weight: bold;
    color:red;     
    height: 40px;
    width: 60px;
    background-color: rgba(248, 244, 244, 0.1);
  
`
const Input = styled.input`
    color:aliceblue;
    height: 30px;
    border: 1px solid #ada9a9;
    padding: 15px;
    margin: 15px;
    background-color: rgba(42, 42, 42, 0.4); 
`

const Section = styled.section`
    display: flex;
    margin: 10px;
    p{
        width: 100px;
    }
    input{
        width: 340px;
    }
`

const HiddenInput = styled.input`
display: none;
   
`

const UploadButton = styled.label` 
  color:#01CD9A;
  height: 45px;
  width: 180px;
  border: 1px solid #aaa;
  background-color: rgba(42, 42, 42, 0.8); /* 어두운 배경색 */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 20px;
  &:hover {
    background-color: rgba(248, 244, 244, 0.1); 
  }
  /* 버튼 내부 텍스트 스타일 */
  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const StyledLink = styled(Link)`
  color: #86918e; /* 기본 색상, 차분한 톤 */
  font-size: 1rem; /* 글씨 크기 */
  font-weight: 500; /* 약간 두꺼운 글씨 */
  text-decoration: none; /* 밑줄 없애기 */
  transition: color 0.3s ease, transform 0.3s ease; /* 색상과 크기 변화 부드럽게 */

  &:hover {
    color: #d4dbda; /* 호버 시 색상 변경 */
    transform: scale(1.05); /* 호버 시 약간 커지는 효과 */
    text-decoration: underline; /* 호버 시 밑줄 추가 */
  }

  &:focus {
    outline: none; /* 포커스 시 외곽선 제거 */
  }
`;



function SideLeftCreateRoom4({ data, create4, setCreate4, create2, category }) {




    const [title, setTitle] = useState(data.userName + "님의 방");
    // 이미지 미리보기
    const [imageSrc, setImageSrc] = useState("http://192.168.0.140/uploadImg/logo.png")
    // UUID로 저장할 이미지 파일명
    const [uuid, setUuid] = useState("\\192.168.0.140/uploadImg/logo.png");

    const [isClose, setIsClose] = useState(false);
    const [message, setMessage] = useState('');


    const inputRef = useRef(null);


    const handleModalClose = () => {
        setCreate4(false);
    }

    const goBack = () => {
        setCreate4(false);
        create2(true);
    }

    const handleTitle = (e) => {
        if(e.target.name === 'cate'){
            return;
        }
        setTitle(() => e.target.value);
    }


    //파일 확장자 체크
    const regex = new RegExp("(.*?)\.(exe|sh|zip|alz)$");
    const MAX_SIZE = 52428800; //50MB


    function checkExtension(fileName, fileSize) {
        if (fileSize >= MAX_SIZE) {
            setMessage('파일 사이즈 초과');
            setIsClose(true);
            return false;
        }
        if (regex.test(fileName)) {
            setMessage('해당 종류의 파일은 업로드 할 수 없습니다.');
            setIsClose(true);
            return false;
        }
        return true;
    }


    //파일 업로드
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            setMessage('파일을 선택하세요');
            setIsClose(true);
            return;
        }
        
        
        const formData = new FormData();
        formData.append("uploadFile", file);

        try {
            const response = await axios.post('/api/room/uploadFile', formData)

            setUuid("\\192.168.0.140/uploadImg/creator/" + response.data);
        } catch (err) {
            console.error("File upload failed:", err);
        }


        if (file && checkExtension(file.name, file.size)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }


    //방 생성
    const createRoom = async () => {
        try {


            const roomName = document.getElementById('roomTitle').value;
            const authCode = (Math.floor(Math.random() * 900000) + 100000).toString(); // 랜덤 인증 코드 생성



            const roomData = {
                userCode: data.userCode,
                roomTitle: roomName,
                roomCategory: category,
                roomIcon: uuid,
                roomInviteCode: authCode,
            };



            const response = await axios.post("/api/room/createRoom", roomData);

            if (response.data === 'success') {
                setMessage('방이 성공적으로 생성되었습니다.');
                setIsClose(true);
                setCreate4(false);
                window.location.href = '/';
            } else {
                setMessage('방 생성에 실패했습니다.');
                setIsClose(true);
            }
        } catch (error) {
            console.error("error" + error);
        }


    }

    //방 생성 후 방장 및 참여 멤버 불러오기





    //이미지 삭제
    const handleDelete = () => {
        const uploadDelete = document.querySelector('#uploadImgOne');
        uploadDelete.src = "" //기존 이미지 삭제
        uploadDelete.style.display = "none" //이미지 숨기기

        // 이미지 관련 상태 초기화
        setImageSrc("");
        setUuid("");

        const formData = new FormData();
        formData.delete("uploadFile");

        const fileInput = document.querySelector('#fileInput');
        fileInput.value = "";  // 파일 입력 필드 초기화

    }

    useEffect(() => {
        // 컴포넌트가 렌더링된 후 커서를 맨 오른쪽으로 이동
        if (inputRef.current) {
            const input = inputRef.current;
            input.focus(); // 포커스를 설정
            input.selectionStart = input.value.length; // 커서를 맨 끝으로 설정
            input.selectionEnd = input.value.length; // 커서를 맨 끝으로 설정
        }
    }, []);


    const handleOnClose = () => {
        setIsClose(false);
    }

    return (
        <Wrapper style={create4 === true ? { display: 'flex' } : { display: 'none' }}>
            <Container>
                <Header>
                    <Span onClick={handleModalClose}>&times;</Span>
                    <H1>방 커스터마이즈하기</H1>
                    <p>방에 이름과 아이콘을 부여해 개성을 드러내 보세요</p>
                    <p>   나중에 언제든 바꿀 수 있어요. </p>
                </Header>
                <Body>
                    <Div1>
                        <HiddenInput
                            accept='image/*'
                            onChange={handleUpload}
                            name="uploadFile"
                            //multiple="multiple"
                            type='file'
                            id='fileInput'
                        >
                        </HiddenInput>
                        <UploadButton htmlFor="fileInput">
                            <span>파일 업로드</span>
                        </UploadButton>
                        <ImageBtn onClick={handleDelete}>삭제</ImageBtn>
                    </Div1>
                    <Div1>
                        <Div>
                            <UploadResult>
                                {imageSrc && <Img id='uploadImgOne' src={imageSrc} alt="Uploaded Preview" />}
                            </UploadResult>
                        </Div>
                    </Div1>
                    <Div3>
                        <Section>
                            <p>방 이름</p>
                            <Input id='roomTitle'
                                type='text'
                                onChange={handleTitle}
                                value={title}
                                placeholder="방 이름을 입력하세요"
                                ref={inputRef}
                                spellCheck={false}
                                autoComplete="off"
                            ></Input>
                        </Section>
                    </Div3>
                    <Div3>
                        <Section>
                            <p>카테고리</p>
                            <Input type='text' name='cate' value={category} onChange={handleTitle}></Input>
                        </Section>
                    </Div3>
                    <Div>
                        <p>방을 만들면 Dixdord의 **<StyledLink>커뮤니티지침</StyledLink>**에 동의하게 됩니다.</p>

                    </Div>
                </Body>
                <Footer>
                    <Div2>

                        <Button onClick={goBack}>뒤로 가기</Button>

                        <Button onClick={createRoom}>만들기</Button>

                    </Div2>
                </Footer>
                {isClose && <Alert message={message} onClose={handleOnClose}/>}
            </Container>
        </Wrapper>
    );
}

export default SideLeftCreateRoom4;