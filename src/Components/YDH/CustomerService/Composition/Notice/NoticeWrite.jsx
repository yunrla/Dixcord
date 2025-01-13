import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ServiceSearch from '../../ServiceSearch';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 useNavigate 사용
import axios from 'axios'; // API 요청을 위해 axios 사용
import Modal from './Modal';

// 스타일 정의
const Area = styled.div`
    display: flex;
    flex-direction: column; /* 세로 정렬 */
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    height: 93vh; /* 전체 화면 기준 높이 */
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow: hidden; /* 전체 영역 초과 시 숨김 */
    padding-bottom: 0; /* 기존 패딩 제거 */
    color: white;

    input::placeholder {
        color: #D9D9D9; /* placeholder 색상 */
    }
`;

const StyledInput = styled.input`
    font-size: 18px;
    width: 100%;
    height: 50px;
    margin: 5px;
    border-radius: 8px;
    background-color: #2D2B31;
    border: none;
    color: white; /* 텍스트 색상 설정 */
    outline: none; /* 포커스 외곽선 제거 */
    padding: 10px; /* 내용 여백 */
    box-sizing: border-box; /* 패딩과 테두리를 포함한 크기 계산 */ 
`;

const Write = styled.div`
    margin-left: 250px;
    margin-right: 250px;
    overflow-y: auto;
    padding-bottom: 20px;

    .areaStyle{
        color: white;
        margin: 5px;
        resize: none;
        width: 100%;
        height: 300px;
        font-size: 18px;
        background-color: #2D2B31;
        border: none;
        border-radius: 8px;
    }

    .file-body{
        text-align: right;
    }

    li{
        list-style-type: none;
    }

    .buttonDiv{
        text-align: right;
    }

    button.register {
        height: 36px;
        font-size: 15px;
        margin: 5px;
        padding: 6px 25px;
        background-color: #01CD9A;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button.register:hover {
        background-color:rgb(2, 163, 123);
    }

    button.reset {
        height: 36px;
        font-size: 15px;
        margin: 5px;
        padding: 6px 25px;
        background-color: transparent;
        color: white;
        border: 2px solid #01CD9A;
        border-radius: 5px;
        cursor: pointer;
    }

    button.reset:hover {
        background-color: rgba(1, 205, 154, 0.1); /* 호버 시 배경색 추가 */
    }

    button.move {
        height: 36px;
        font-size: 15px;
        margin: 5px;
        padding: 6px 25px;
        background-color: transparent;
        color: white;
        border: 2px solid #01CD9A;
        border-radius: 5px;
        cursor: pointer;
    }

    button.move:hover {
        background-color: rgba(1, 205, 154, 0.1); /* 호버 시 배경색 추가 */
    }

    .file-preview-container {
        display: flex; /* 가로 정렬 */
        justify-content: flex-end; /* 오른쪽 정렬 */
        gap: 10px; /* 파일 간격 */
        overflow-x: auto; /* 가로 스크롤 활성화 */
        padding: 10px 0;
    }

    .file-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    img {
        border-radius: 8px; /* 이미지에 둥근 모서리 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
    }
`;

const StyledFileInput = styled.label`
    display: inline-block;
    padding: 10px 20px;
    background-color: #01CD9A;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    &:hover {
        background-color: rgb(2, 163, 123);
    }
`;

const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282; /* 상단 경계선 */
    height: 11%; /* 높이를 %로 설정 */
`;

// NoticeWrite 함수형 컴포넌트 선언
// props 부모 컴포넌트로부터 전달된 속성
function NoticeWrite({data}) {
    const nav = useNavigate();

    useEffect(()=>{
        console.log(data);
        console.log(data.userCode);
    },[data])


    // 게시글 입력 값 관리
    const [inputs, setInputs] = useState({
        userCode: data.userCode,
        title: '',
        writer: data.userName,
        content: '',
    });

    // 업로드된 파일 정보 관리
    const [uploadedFiles, setUploadedFiles] = useState({
        uuid: '',
        uploadPath: '',
        uploadName: ''
    });

    const [successModal, setSuccessModal] = useState(false); // 성공 모달 상태 관리
    const [errorModal, setErrorModal] = useState(false); // 에러 모달 상태 관리
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleChangeInputs = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

     // 게시글 등록 버튼 클릭 시 실행되는 함수
     const registerNotice = async () => {
        try {
            const inputValueArr = Object.values(inputs);
            const isEmpty = inputValueArr.some(value => value === '');

            if (isEmpty) {
                setModalMessage("모든 내용을 입력하세요.");
                setErrorModal(true); // 에러 모달 활성화
                return;
            }

            const requestData = {
                inputs: inputs,
            };

            if (uploadedFiles.uuid) {
                requestData.uploadedFiles = uploadedFiles;
            }

            const response = await axios.post('/NoticeWrite', requestData);

            if (response.status === 200) {
                setModalMessage("등록이 완료되었습니다!");
                setSuccessModal(true); // 성공 모달 활성화
            }
        } catch (error) {
            const errorMessage = error.response && error.response.status === 500
                ? "서버 오류가 발생했습니다. 잠시 후 다시 시도하세요."
                : "알 수 없는 오류가 발생했습니다.";
            setModalMessage(errorMessage);
            setErrorModal(true); // 에러 모달 활성화
        }
    };

    const resetInputs = () => {
        setInputs({
            userCode: data.userCode,
            title: '',
            writer: data.userName,
            content: '',
        });
        setUploadedFiles([]);
    };

    const moveToNoticeList = () => {
        nav('/service/notice');
    };

    const handleFileUpload = async (files) => {
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'jfif']; // 허용된 확장자 목록
        const formData = new FormData();
        const filePreviews = []; // 이미지 미리보기 URL 저장
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExtension = file.name.split('.').pop().toLowerCase(); // 확장자 추출
            
            if (!allowedExtensions.includes(fileExtension)) {
                alert(`"${file.name}"은(는) 허용되지 않는 파일 형식입니다.`);
                return;
            }
    
            formData.append('uploadFile', file);
    
            // 이미지 미리보기 URL 생성
            const fileURL = URL.createObjectURL(file);
            filePreviews.push({ name: file.name, url: fileURL });
        }
    
        setSelectedFiles(filePreviews); // 선택된 파일 상태 업데이트
    
        try {
            const response = await axios.post('/noticeUploadFiles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                console.log('Uploaded files:', response.data);
                setUploadedFiles(...response.data);
            }
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        setTodayDate(formattedDate);
    }, []);

    return (
        <Area>
            <HeaderContainer>
                <ServiceSearch />
            </HeaderContainer>
            <Write>
                <div>
                    <h1>공지사항 등록</h1>
                    <div>
                        <input type="hidden" name='userCode' value={inputs.userCode} />
                        <StyledInput
                            className='titleInput'
                            type="text"
                            name="title"
                            value={inputs.title}
                            onChange={handleChangeInputs}
                            placeholder=" 제목을 작성하세요."
                        />
                    </div>
                    <div>
                        <StyledInput
                            type="text"
                            name="writer"
                            value={inputs.writer}
                            onChange={handleChangeInputs}
                            placeholder={data.userName}
                            readOnly
                        />
                    </div>
                    <div>
                        <StyledInput
                            type="text"
                            name="writer"
                            onChange={handleChangeInputs}
                            placeholder={` 작성일 : ${todayDate}`}
                            readOnly
                        />
                    </div>
                    <div className="file-container">
                        <div className="file-header">
                        </div>
                        <div className="file-body">
                            <div className="uploadDiv">
                                <StyledFileInput htmlFor="fileUpload">파일 선택</StyledFileInput>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    name="uploadFile"
                                    multiple
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    style={{ display: 'none' }} // 기본 파일 업로드 input 숨기기
                                />
                            </div>
                            <div className="selected-files">
                            {selectedFiles.length > 0 ? (
                                <div className="file-preview-container">
                                    {selectedFiles.map((file, index) => (
                                        <div className="file-preview" key={index}>
                                            <p>{file.name}</p>
                                            {file.url && (
                                                <img 
                                                    src={file.url} 
                                                    alt={file.name} 
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '5px' }} 
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span>선택된 파일이 없습니다.</span>
                            )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <textarea
                            className='areaStyle'
                            name="content"
                            cols={30}
                            rows={10}
                            value={inputs.content}
                            onChange={handleChangeInputs}
                            placeholder=" 내용을 입력하세요."
                        ></textarea>
                    </div>
                    <div className='buttonDiv'>
                        <button className='register' onClick={registerNotice}>등록</button>
                        <button className='reset' onClick={resetInputs}>초기화</button>
                        <button className='move' onClick={moveToNoticeList}>목록으로 이동</button>
                    </div>
                </div>
            </Write>
            {/* 성공 모달 */}
            <Modal
                isOpen={successModal}
                onClose={() => {
                    setSuccessModal(false);
                    moveToNoticeList(); // 성공 시 목록으로 이동
                }}
                message={modalMessage}
            />

            {/* 에러 모달 */}
            <Modal
                isOpen={errorModal}
                onClose={() => setErrorModal(false)} // 에러 모달 닫기
                message={modalMessage}
            />
        </Area>
    );
}

export default NoticeWrite;