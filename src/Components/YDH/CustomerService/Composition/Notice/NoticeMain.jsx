import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ServiceSearch from '../../ServiceSearch';
import NoticePost from './NoticePost';
import RecentAndRelated from '../../../RecentAndRelated/RecentAndRelated';
import axios from 'axios';

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
`;

const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282; /* 상단 경계선 */
    height: 11%; /* 높이를 %로 설정 */
`;

const BodyContainer = styled.div`
    overflow-y: auto;
    height: 80%; /* 높이를 %로 설정 */
    margin-bottom: 10px;
`;

const FooterContainer = styled.div`
    border-top: 2px solid #828282; /* 상단 경계선 */
    height: 15%; /* 높이를 %로 설정 */
`;

function NoticeMain({getUser, setSideBarStatus}) {
    const [noticeList, setNoticeList] = useState([]);
    // const [recentPages, setRecentPages] = useState([]);
    // const [titles, setTitles] = useState({});

    // 공지사항 리스트 가져오기
    const getNoticeList = async () => {
        try {
            const resp = await axios.get('/noticeList');
            setNoticeList(resp.data);
        } catch (error) {
        }
    };

    useEffect( () => {
            setSideBarStatus('service');
        }, []);

    // // 최근 페이지 정보 가져오기
    // const getRecentPages = async () => {
    //     const pages = JSON.parse(localStorage.getItem("recentPages")) || [];
    //     const filteredPages = pages.filter(
    //         (page) => !["/service/notice", "/service/qna"].includes(page)
    //     ).slice(0, 4);

    //     setRecentPages(filteredPages);

    //     // 제목 정보 가져오기
    //     const fetchedTitles = {};
    //     for (const path of filteredPages) {
    //         const idx = path.split("/").pop();
    //         if (!isNaN(idx)) {
    //             try {
    //                 const response = await axios.get(`/getNoticeTitle?idx=${idx}`);
    //                 fetchedTitles[path] = response.data;
    //             } catch (error) {
    //                 console.error("제목 정보 가져오기 에러:", error);
    //             }
    //         }
    //     }
    //     setTitles(fetchedTitles);
    // };

    useEffect(() => {
        getNoticeList();
        // getRecentPages();
    }, []);

    return (
        <Area className='backgCon' style={getUser === null ? {width : '70%', marginLeft : '15%'} : {width : '100%'}}>
            <HeaderContainer>
                <ServiceSearch />
            </HeaderContainer>
            <BodyContainer>
                <NoticePost noticeList={noticeList} getUser={getUser} />
                {/* <NoticePost/> */}
            </BodyContainer>
            <FooterContainer>
                {/* <RecentAndRelated recentPages={recentPages} titles={titles} /> */}
                <RecentAndRelated/>
            </FooterContainer>
        </Area>
    );
}

export default NoticeMain;