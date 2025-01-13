import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebarsearch from '../../../SidebarSearch/Sidebarsearch';

const PostList = styled.div`
    margin-top: 10px;
    margin-left: 100px;
    margin-right: 100px;

    section {
        margin-bottom: 20px;
    }

    .subject {
        display: flex;
        justify-content: space-between; /* h1과 button을 양쪽에 배치 */
        align-items: center; /* 세로 가운데 정렬 */
        margin-bottom: 20px; /* 하단 여백 */
    }

    button.noticeButton {
        padding: 10px 20px;
        background-color: #01CD9A;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button.noticeButton:hover {
        background-color: rgb(2, 163, 123);
    }

    .listLi {
        list-style-type: none;
        font-size: 1rem; /* 원하는 크기로 설정 */
        margin-bottom: 5px; /* 목록 항목 간의 여백 추가 */
    }

    .listLi a {
        color: white; /* 링크 색상 설정 */
        text-decoration: none; /* 밑줄 제거 */
    }

    .listLi a:hover {
        text-decoration: underline; /* 링크에 호버 시 밑줄 추가 */
    }

    /* ul을 grid로 설정 */
    ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 한 줄에 두 개씩 배치 */
        gap: 20px; /* 항목 간의 간격 */
    }

    .toggleContainer {
        display: flex;
        justify-content: center; /* 버튼을 가로 방향으로 가운데 정렬 */
        margin-top: 20px; /* 위로 여백 추가 */
    }

    button.toggleButton {
        border-radius: 3px;
        background-color: #01CD9A;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 10px;
        color: white;
    }

    button.toggleButton:hover {
        background-color: rgb(2, 163, 123);
        text-decoration: underline;
    }
`;

const StyledImage = styled.img`
    width: 250px; /* 원하는 너비 */
    height: 150px; /* 원하는 높이 */
    object-fit: cover; /* 이미지 비율 유지 */
    margin: 10px; /* 외부 여백 */
`;

// 이미지와 텍스트를 가로로 정렬하는 컨테이너
const FlexContainer = styled.div`
    display: flex;
    align-items: center; /* 세로 정렬 (이미지와 텍스트를 가운데로 맞춤) */
    gap: 10px; /* 요소 간 간격 */
`;

const NoticePost = ({getUser}) => {
    const nav = useNavigate();
    const [noticeList, setNoticeList] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // 펼쳐진 상태 관리
    const [attachments, setAttachments] = useState({}); // 첨부파일 정보를 저장
    const [selectedFiles, setSelectedFiles] = useState([]);

    const getNoticeList = async () => {
        try {
            const resp = await axios.get('/noticeList');
            const data = resp.data;
            setNoticeList(data);
        } catch (error) {
            console.error("게시판 리스트 에러 발생:", error);
        }
    };

    const getAttachList = async (idx) => {
        try {
            const resp = await axios.get(`/getAttachList/${idx}`);
            const data = resp.data;
            setAttachments((prev) => ({ ...prev, [idx]: data })); // 상태에 각 idx별 데이터 저장
        } catch (error) {
            console.error("첨부파일 리스트 가져오기 에러 발생:", error);
        }
    };

    useEffect(() => {
        getNoticeList();
    }, []);

    useEffect(() => {
        if (noticeList.length > 0) {
            noticeList.forEach((notice) => {
                getAttachList(notice.idx); // 각 게시글의 첨부파일 호출
            });
        }
    }, [noticeList]);

    const moveWritePage = () => {
        nav('/service/notice/write');
    };

    const toggleList = () => {
        setIsExpanded(!isExpanded);
    };

    // 표시할 리스트 제한
    const displayedNotices = isExpanded ? noticeList : noticeList.slice(0, 6);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`; // 'YYYY/MM/DD' 형식으로 반환
    };

    const renderImage = (idx) => {
        const files = attachments[idx] || [];
        const imageFile = files.find((file) => {
            const extension = file.uploadName.split('.').pop().toLowerCase();
            return ['png', 'jpg', 'jpeg', 'gif'].includes(extension);
        });

        if (imageFile) {
            const fileUrl = `//DESKTOP-8UUQVVD/uploadImg/${imageFile.uploadPath}/${imageFile.uploadName}`;
            return <StyledImage src={fileUrl} alt={imageFile.uploadName} />;
        }
        return <StyledImage src="/images/ydh/default.jpeg" alt="default" />;
    };

    console.log(getUser);
    

    return (
        <PostList>
            <section className="subject textCol">
                <h1>공지사항</h1>
                {getUser && getUser.userAuth === 'ROLE_ADMIN' && (
                    <button className="noticeButton" onClick={moveWritePage}>
                        공지글 등록
                    </button>
                )}
            </section>
            <section>
                <ul>
                    {displayedNotices.length > 0 ? (
                        displayedNotices.map((notice, index) => (
                            <li className="listLi" key={index}>
                                <Link to={`/service/notice/${notice.idx}`}>
                                    <FlexContainer>
                                        {renderImage(notice.idx)}
                                        <div className='textCol'>
                                            <span>{notice.writer}</span>
                                            <h2>{notice.title}</h2>
                                            <span>
                                                {notice.updateDate ? formatDate(notice.updateDate) : 'N/A'}
                                            </span>
                                        </div>
                                    </FlexContainer>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li>게시글이 없습니다.</li>
                    )}
                </ul>
                {noticeList.length > 4 && (
                    <div className="toggleContainer">
                        <button className="toggleButton" onClick={toggleList}>
                            {isExpanded ? '접기' : '더보기'}
                        </button>
                    </div>
                )}
            </section>
        </PostList>
    );
};

export default NoticePost;
