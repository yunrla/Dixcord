import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function MyInq({ getUser, setSideBarStatus }) {

    const nav = useNavigate();

    const [questionList, setQuestionList] = useState([]);

    const [completeInq, setCompleteInq] = useState([]);

    useEffect(() => {

        
        const getNoticeList = () => {
            try {
                axios.get(`/mypage/myquestions/questionlist?userCode=${getUser.userCode}`)
                .then(response => {
                        let pendingQuestions = [];
                
                        let completedQuestions = [];
                        response.data.forEach(re => {
                            if(re.inquiryState === '처리 전'){
                                pendingQuestions.push(re);
                            }else {
                                completedQuestions.push(re);
                            }
                        });
                        setQuestionList(pendingQuestions);
                        setCompleteInq(completedQuestions);
                    });
            } catch (error) {
                //console.error("게시판 리스트 에러 발생:", error);
            }
        };
    
        if (getUser && getUser.userCode) {
            getNoticeList();
        }
    }, [getUser]);

    const handleMyinq = () => {
        setSideBarStatus('service');
        nav('/mypage/myquestions/' + getUser.userCode);
    }

    const handleGoInq = () => {
        setSideBarStatus('service');
        nav('/service/myquestion');
    }

    const handleService = () => {
        setSideBarStatus('service');
        nav('/service');
    }

    return (
        <Container>
            <MainArea className='backgCon'>
                <div>
                <TopSection>
                    <TotalInquiries>
                        나의 총 문의개수: <strong>[  {questionList.length + completeInq.length}  ] 개</strong>
                    </TotalInquiries>
                </TopSection>

                <MiddleSection2>
                    <h2>항상 소중한 관심을 주셔서 감사합니다.</h2>
                    <h3>고객님의 소중한 말씀은 저희에게 매우 도움이 됩니다. 부담없이 궁금하신 점이나 개선사항을 말해주시면 감사하겠습니다.</h3>
                </MiddleSection2>

                <MiddleSection>
                    <MiddleItem>
                        <MiddleTitle>처리 중 문의</MiddleTitle>
                        <MiddleValue>[ <span style={{color : 'blueviolet'}} onClick={handleMyinq}> {questionList.length} </span> ] 개</MiddleValue>
                    </MiddleItem>
                    <MiddleItem> 
                        <MiddleTitle>처리 완료 문의</MiddleTitle>
                        <MiddleValue>[ <span style={{color : '#01CD9A'}} onClick={handleMyinq}> {completeInq.length} </span> ] 개</MiddleValue>
                    </MiddleItem>
                    <MiddleItem>
                        <MiddleTitle style={{marginTop : '20px', marginBottom : '0px'}}>내 문의 내역</MiddleTitle>
                        <StyledButton onClick={handleMyinq}>이동</StyledButton>
                    </MiddleItem>
                </MiddleSection>
                </div>

                <BottomSection>
                    <StyledButton style={{marginRight : '30px'}} onClick={handleGoInq}>1:1 문의</StyledButton>
                    <StyledButton onClick={handleService}>고객센터</StyledButton>
                </BottomSection>
            </MainArea>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

const MainArea = styled.div`
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto;
    padding: 20px;
`;

const TopSection = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    margin-bottom: 30px;
`;

const TotalInquiries = styled.div`
    color: white;
    font-size: 20px;
    font-weight: 700;
`;

const MiddleSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
`;

const MiddleSection2 = styled.div`
    display: block;
    margin-bottom: 30px;
    align-content : center;
    justify-content: center;
    text-align: center;
`;

const MiddleItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height : 150px;
    button {
        background-color : #01CD9A;

        &:hover{
            background-color :rgb(1, 205, 96);
        }
    }
`;

const MiddleTitle = styled.div`
    color: white;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 40px;
`;

const MiddleValue = styled.div`
    color: white;
    font-size: 18px;
    font-weight: 700;

    span{
        cursor : pointer;
    }
`;

const StyledButton = styled.button`
    background-color: #0066cc;
    width : 120px;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #005bb5;
    }
`;

const BottomSection = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;
`;

export default MyInq;
