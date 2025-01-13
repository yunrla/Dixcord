import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoticeSearch from '../../ServiceSearch';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import RecentAndRelated from '../../../RecentAndRelated/RecentAndRelated';

// 스타일 컴포넌트로 이미지 크기 설정
const Area = styled.div`
    img {
        max-width: 700px;
    }
    margin-top: 10px;
    margin-right: 10px;
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    height: 93vh; /* 전체 화면 기준 높이 */
    margin-bottom: 10px;
    margin-left: 0;
    border-radius: 20px;
    display: flex;
    flex-direction: column; /* 세로 정렬 */
`;

const NoticePostDetail = styled.div`
    margin-right: 215px;
    margin-left: 200px;
    overflow-y: auto;
    height: 80%; /* 높이를 %로 설정 */
    margin-bottom: 10px;

    .NoticeContent {
        padding-top: 20px;
        word-wrap: break-word; /* 긴 단어를 줄 바꿈 */
    }

    button.modifyButton {
        padding: 10px 20px;
        background-color: #01CD9A;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 2px;
    }
`;


const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282; /* 상단 경계선 */
    height: 11%; /* 높이를 %로 설정 */
`;

const FooterContainer = styled.div`
    border-top: 2px solid #828282; /* 상단 경계선 */
    height: 15%; /* 높이를 %로 설정 */
`;

const WriterInfo = styled.div`
    display: flex;
    align-items: center; /* 세로 정렬을 가운데로 */
    margin-bottom: 10px; /* 아래 간격 추가 */
    gap: 10px; /* 아이콘과 텍스트 간 간격을 설정 */
`;

const WriterDetails = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px; /* 텍스트 크기 조정 */
`;

const NoticeContent = styled.div`
    margin: 5px;
    width: 100%;
    height: 100%;
    font-size: 18px;
    background-color:transparent;
    border: none;
    border-radius: 8px;
    white-space: pre-wrap;  // 텍스트 줄 바꿈을 유지
    word-wrap: break-word;  // 긴 단어가 줄 바꿈
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    /* margin-right를 없애고 gap을 사용하여 간격을 설정했기 때문에 추가할 필요 없음 */
`;

function NoticeDetail({getUser}) {
    // 페이지 이동을 위한 navigate 함수 사용
    const nav = useNavigate();
    // URL에서 'idx' (게시글 번호)를 가져오기
    const { idx } = useParams(); 
    // 게시글 상세 데이터를 저장할 상태
    const [notice, setNotice] = useState({}); 
    // 첨부파일 리스트 데이터를 저장할 상태
    const [attachments, setAttachments] = useState([]); 

    // 게시글 상세 데이터를 가져오는 함수
    const getNoticeList = async () => {
        try {
            const resp = await axios.get(`/service/notice/${idx}`);
            const data = resp.data;
            setNotice(data); // 응답 데이터를 notice 상태에 저장
        } catch (error) {
        }
    };

    // 첨부파일 리스트를 가져오는 함수
    const getAttachList = async () => {
        try {
            const resp = await axios.get(`/getAttachList/${idx}`);
            const data = resp.data;
            setAttachments(data); // 응답 데이터를 attachments 상태에 저장
        } catch (error) {
        }
    };

    // 컴포넌트가 처음 렌더링될 때, 게시글 및 첨부파일 데이터를 가져오기
    useEffect(() => {
        getNoticeList();
        getAttachList();
    }, []); // 빈 배열을 넣어 한번만 실행되도록 설정

    // 수정 페이지로 이동하는 함수
    const moveToNoticeModify = () => {
        nav('/service/notice/modify/' + idx); // 해당 게시글의 idx로 수정 페이지 이동
    };

    // 목록 페이지로 이동하는 함수
    const moveToNoticeList = () => {
        nav('/service/notice'); // 공지사항 목록 페이지로 이동
    };

    // 날짜 포맷을 'YYYY/MM/DD' 형식으로 변환하는 함수
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`; // 'YYYY/MM/DD' 형식으로 반환
    };

    // 첨부파일을 렌더링하는 함수
    const renderAttachments = () => {
        const basePath = '//DESKTOP-8UUQVVD/uploadImg'; // 서버 경로
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    
        return attachments.map((file, index) => {
            const extension = file.uploadName.split('.').pop().toLowerCase();
            const fileUrl = `${basePath}/${file.uploadPath}/${file.uploadName}`;
            if (imageExtensions.includes(extension)) {
                return <img key={index} src={fileUrl} alt={file.uploadName} />;
            } else {
                return (
                    <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {file.uploadName}
                    </a>
                );
            }
        });
    };

    return (
        <Area className='backgCon' style={getUser === null ? {width : '70%', marginLeft : '15%'} : {width : '100%'}}>
            {/* 검색 컴포넌트 */}
            <HeaderContainer>
                <NoticeSearch />
            </HeaderContainer>
            <NoticePostDetail>
                {/* notice 상태에 데이터가 있을 경우 */}
                {notice ? (
                    <div>
                        {/* 게시글 내용을 테이블로 표시 */}
                        <table>
                            <tbody>
                                <tr>
                                    <td><h1>{notice.title}</h1></td> {/* 제목 */}
                                </tr>
                                <tr>
                                    <td>
                                        <WriterInfo>
                                            {/* 작성자 아이콘 */}
                                            <UserIcon src={notice.userIcon !== null ? "http://192.168.0.140/uploadImg/userImg/" + notice.userIcon : '/images/userIcon'}
                                            alt="22" name='userIcon' 
                                            onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                                            {/* 작성자 및 날짜 */}
                                            <WriterDetails>
                                                <span>{notice.writer}</span> {/* 작성자 */}
                                                <span>
                                                    작성일 {notice.regDate ? formatDate(notice.regDate) : "N/A"} | 
                                                    수정일 {notice.updateDate ? formatDate(notice.updateDate) : "N/A"}
                                                </span>
                                            </WriterDetails>
                                        </WriterInfo>
                                    </td>
                                </tr>
                        {/* 첨부파일이 있을 경우 렌더링 */}
                        <div>
                            {attachments && attachments.length > 0 ? renderAttachments() : null}
                        </div>
                            <NoticeContent>{notice.content}</NoticeContent> {/* 내용 */}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>로딩 중입니다...</p> // 데이터 로딩 중일 때 표시할 메시지
                )}
                {/* 수정 및 목록 페이지로 이동하는 버튼 */}
                <div>
                    {getUser && getUser.userAuth === 'ROLE_ADMIN' && (
                        <button className='modifyButton' onClick={moveToNoticeModify}>
                            수정
                        </button>
                    )}
                    <button className='modifyButton' onClick={moveToNoticeList}>목록</button>
                </div>
            </NoticePostDetail>
            <FooterContainer>   
                <RecentAndRelated />
            </FooterContainer>
        </Area>
    );
}

export default NoticeDetail;
