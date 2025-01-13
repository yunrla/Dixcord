import React, { useEffect, useState } from 'react';
import ServiceSearch from '../../ServiceSearch';
import styled from 'styled-components';
import { qnaUserConfigData, qnaServerConfigData, qnaChatConfigData, qnaSecurityConfigData } from '../../../../../data/qna';
import RecentAndRelated from '../../../RecentAndRelated/RecentAndRelated';

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

const ServiceQnA = styled.div`
    margin-right: 250px;
    margin-left: 250px;

    .category{
        text-align: center;
        font-size: 20px;
        
    }

    .category span{
        cursor: pointer;
    }

    .Q{
        padding: 10px;
        font-size: 15px;
        text-decoration: underline; /* 밑줄 추가 */
        text-underline-offset : 8px; /* 밑줄 위치 */
        text-decoration-color: #01CD9A; /* 밑줄 색상 설정 */
        cursor: pointer; /* 클릭 가능한 느낌을 주기 위해 포인터 추가 */
        margin-bottom: 10px; /* 질문과 답변 간격 */
        
    }
    
    .A {
        text-decoration: underline; /* 밑줄 추가 */
        text-underline-offset : 8px; /* 밑줄 위치 */
        margin-left: 40px; /* 답변 들여쓰기 */
        margin-bottom: 7px;
        line-height: 30px;
    }
        
`

const QnAMain = ({setSideBarStatus, getUser}) => {
    const [selectedCategory, setSelectedCategory] = useState("user"); // 기본값으로 'user' 카테고리
    const [openIndex, setOpenIndex] = useState(null); // 열려있는 질문의 인덱스

    const handleToggle = (index) => {
        if (openIndex === index) {
            setOpenIndex(null); // 이미 열려있으면 닫기
        } else {
            setOpenIndex(index); // 클릭된 질문의 인덱스 설정
        }
    };

    useEffect( () => {
        setSideBarStatus('service');
    }, []);

    // 선택된 카테고리에 따라 데이터를 필터링
    const qnaData = 
          selectedCategory === "user" 
        ? qnaUserConfigData 
        : selectedCategory === "server" 
        ? qnaServerConfigData 
        : selectedCategory === "chat" 
        ? qnaChatConfigData
        : qnaSecurityConfigData; 

    return (
        <Area className='backgCon' style={getUser === null ? {width : '70%', marginLeft : '15%'} : {width : '100%'}}>
            <HeaderContainer>
                <ServiceSearch/>
            </HeaderContainer>
            <BodyContainer>
                <ServiceQnA>
                <h1>자주 묻는 질문</h1>
                {/* 카테고리 선택 버튼 */}
                <div className="category" style={{marginBottom : '25px'}}>
                    {["user", "server", "chat", "security"].map((category) => (
                        <span
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                textDecoration: selectedCategory === category ? "underline" : "none",
                                textDecorationColor: selectedCategory === category ? "#01CD9A" : "transparent",
                                cursor: "pointer",
                                margin: "0 30px",
                            }}
                        >
                            {category === "user" && "유저 설정"}
                            {category === "server" && "서버 설정"}
                            {category === "chat" && "채팅방 설정"}
                            {category === "security" && "보안 설정"}
                        </span>
                    ))}
                </div>

                {/* 선택된 카테고리에 맞는 Q&A 리스트 출력 */}
                {qnaData.map((item, index) => (
                    <div key={index}>
                        <div className='Q' onClick={() => handleToggle(index)} // 클릭하면 토글
                        >
                            {item.q}
                        </div>
                        {openIndex === index && ( // 질문이 열려있으면 답변을 보여줌
                            <div className='A'>
                                {item.a}
                            </div>
                        )}
                    </div>
                ))}
            </ServiceQnA>
        </BodyContainer>
        <FooterContainer>
            <RecentAndRelated/>
        </FooterContainer>
        </Area>
    );
};

export default QnAMain;