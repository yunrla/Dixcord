import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ServiceSearch from '../../ServiceSearch';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';

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

const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282; /* 상단 경계선 */
    height: 11%; /* 높이를 %로 설정 */
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

const PostWrite = styled.div`
    margin-left: 250px;
    margin-right: 250px;

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

    button{
        padding: 10px 20px;
        background-color: #01CD9A;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
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
`;

function NoticeModify(props) {
    const nav = useNavigate();
    const { idx } = useParams(); // URL 파라미터에서 글 번호를 가져옴
    const [notice, setNotice] = useState({
        idx: '',
        title: '',
        writer: '',
        content: ''
    });

    // 기존 게시글 데이터 불러오기
    const fetchNoticeDetail = async () => {
        try {
            const resp = await axios.get(`/service/notice/${idx}`);
            setNotice(resp.data);
        } catch (error) {
            setModalMessage('게시글 불러오기 중 문제가 발생했습니다.');
            setModalOpen(true);
        }
    };

    useEffect(() => {
        fetchNoticeDetail();
    }, []);

    // 입력 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotice({ ...notice, [name]: value });
    };

    // 수정 버튼 클릭 시 서버로 전송
    const noticeModify = async () => {
        try {
            await axios.post(`/service/notice/modify/${idx}`, notice);
            setModalMessage('게시글이 수정되었습니다.');
            setOnConfirm(() => () => nav(`/service/notice/${idx}`));
            setModalOpen(true);
        } catch (error) {
            setModalMessage('수정 중 문제가 발생했습니다.');
            setOnConfirm(null);
            setModalOpen(true);
        }
    };

    
    // 삭제 버튼
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);
    const [hideCloseButton, setHideCloseButton] = useState(false);

    // 삭제 버튼
    const noticeDelete = async () => {
        setModalMessage('정말로 삭제하시겠습니까?');
        setOnConfirm(() => async () => {
            try {
                await axios.get(`/noticeDelete/${idx}`, notice);
                setModalMessage('게시글이 삭제되었습니다.');
                setHideCloseButton(true); // 닫기 버튼 숨기기
                setOnConfirm(() => () => nav('/service/notice')); // 확인 시 목록 페이지로 이동
            } catch (error) {
                setModalMessage('삭제 중 문제가 발생했습니다.');
                setHideCloseButton(false); // 닫기 버튼 표시
                setOnConfirm(null);
            } finally {
                setModalOpen(true);
            }
        });
        setModalOpen(true);
    };
    
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
            const now = new Date();
            const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
            setTodayDate(formattedDate);
        }, []);

    const moveToNoticeDetail  = () => {
        nav('/service/notice/' + idx);
    };
    return (
        <Area>
            <HeaderContainer>
                <ServiceSearch/>
            </HeaderContainer>
            <hr />
            <PostWrite>
                <div>
                    <h1>공지사항 수정</h1>
                    <div>
                        <StyledInput type="text" name="title" value={notice.title} onChange={handleChange} />
                    </div>
                    <div>
                        <StyledInput type="text" name="writer" value={notice.writer} readOnly/>
                    </div>
                    <div>
                        <StyledInput
                            type="text"
                            name="writer"
                            placeholder={` 수정일 : ${todayDate}`}
                            readOnly
                        />
                    </div>
                    <div>
                        <textarea
                            className='areaStyle'
                            rows="10"
                            cols="76"
                            name="content"
                            value={notice.content}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='buttonDiv'>
                        <button className='register' onClick={noticeModify}>수정 완료</button>
                        <button className='reset' onClick={noticeDelete}>삭제</button>
                        <button className='move' onClick={moveToNoticeDetail}>취소</button> {/* 이전 페이지로 돌아가기 */}
                    </div>
                </div>
            </PostWrite>
            {/* 모달 */}
            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
                onConfirm={onConfirm}
                hideCloseButton={hideCloseButton}
            />
        </Area>
    );
}

export default NoticeModify;