import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ServiceSearch from '../../ServiceSearch';

const Area = styled.div`
    display: flex;
    flex-direction: column;
    background-color: rgba(30, 31, 34, 0.7);
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow: hidden;
    padding-bottom: 0;
    color: white;
`;

const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282;
`;

const QuestionList = styled.div`
    padding-right: 250px;
    padding-left: 250px;
    overflow-y: auto;
`;

const StyledListItem = styled.li`
    display: flex;
    align-items: center;
    border: 1px solid #01CD9A;
    margin: 20px;
    border-radius: 6px;
    padding: 10px;
`;

const StyledImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    margin: 10px;
    border-radius: 50%;
`;

const StyledSpan = styled.span`
    display: inline-block;
    margin-left: 10px;
    max-width: 80%; /* 텍스트의 가로 길이를 제한 */

    &.content {
        font-size: 20px;
        white-space: ${(props) => (props.isExpanded ? 'normal' : 'nowrap')}; /* 펼쳐졌을 때 여러 줄로 보이도록 */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &.category {
        font-size: 12px;
    }

    &.inquiryDate {
        font-size: 12px;
    }
`;

const ExpandButton = styled.button`
    background: none;
    border: none;
    color: #01CD9A;
    cursor: pointer;
    font-size: 18px;
    margin-left: 40px;
`;

const MyQuestionList = () => {
    const { userCode } = useParams();
    const [questionList, setQuestionList] = useState([]);
    const [targetInq, setTargetInq] = useState(null);
    const [adminInq, setAdminInq] = useState(null);

    useEffect(() => {

        const getNoticeList = async () => {
            try {
                const resp = await axios.get('/mypage/myquestions/questionlist', {
                    params: { userCode },
                });
                setQuestionList(resp.data);
            } catch (error) {
            }
        };

        if (userCode) {
            getNoticeList();
        }
    }, [userCode]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const [expandedQuestionIds, setExpandedQuestionIds] = useState(new Set());
    const maxLength = 20; // 텍스트가 100자를 초과할 경우 펼치기 버튼을 보여줌

    const toggleExpand = (inquiryNo) => {
        setExpandedQuestionIds((prevState) => {
            const newState = new Set(prevState);
            if (newState.has(inquiryNo)) {
                newState.delete(inquiryNo);
            } else {
                newState.add(inquiryNo);
            }
            return newState;
        });
    };

    const handleClickInquiry = (e, inq) => {


        if(targetInq !== null){
            if(document.querySelector(`#inq${targetInq.inquiryNo}`)){
                document.querySelector(`#inq${targetInq.inquiryNo}`).style.display = 'none';
            }
        }

        setAdminInq(null);

        axios.get(`/admin/api/getAdminInquiryByInquiryNo?inquiryNo=${inq.inquiryNo}`)
            .then(response => {
                if(response.data !== ''){

                    setAdminInq(response.data);
                    
                    document.querySelector(`#inq${inq.inquiryNo}`).style.display = 'flex';
            
                    setTargetInq(inq);
                }else {
                    document.querySelector(`#inq${inq.inquiryNo}`).style.display = 'flex';
            
                    setTargetInq(inq);
                    return;
                }
            });

    }

    const handleClickClose = () => {
        document.querySelector(`#inq${targetInq.inquiryNo}`).style.display = 'none';
    }

    return (
        <Area className='backgCon'>
            <HeaderContainer>
                <ServiceSearch />
            </HeaderContainer>
            <QuestionList>
                <h1>내 문의 리스트</h1>
                <ul>
                    {questionList.length > 0 ? (
                        questionList.map((question) => {
                            const isLongText = question.content.length > maxLength;
                            return (
                                <div>
                                <StyledListItem key={question.inquiryNo} onClick={(e) => handleClickInquiry(e, question)}>
                                    <StyledImage src="/images/ydh/questionIcon.png" />
                                    <StyledSpan
                                        className="content"
                                        isExpanded={expandedQuestionIds.has(question.inquiryNo)}
                                    >
                                        {isLongText
                                            ? expandedQuestionIds.has(question.inquiryNo)
                                            ? question.content
                                            : question.content.slice(0, maxLength) + "..."
                                            : question.content}
                                    </StyledSpan>
                                    <StyledSpan className="category">{question.category}</StyledSpan>
                                    <StyledSpan className="inquiryDate">{formatDate(question.inquiryDate)}</StyledSpan>
                                    {question.inquiryState === '처리 전' ? <StyledSpan className="category" style={{color : '#808080'}}>[처리 중]</StyledSpan> : <StyledSpan className="category" style={{color : '#01CD9A'}}>[처리 완료]</StyledSpan>}
                                    {isLongText && (
                                        <ExpandButton onClick={() => toggleExpand(question.inquiryNo)}>
                                            {expandedQuestionIds.has(question.inquiryNo) ? '△' : '▽'}
                                        </ExpandButton>
                                    )}
                                </StyledListItem>
                                <UserInputSection2 id={'inq' + question.inquiryNo} style={{display : 'none'}}>
                                {adminInq !== null ?
                                    <div>
                                        <h3>{adminInq.userName}님의 답변</h3>
                                        <p>{adminInq.message}</p>
                                    </div>
                                    :
                                    <div>
                                        <h3>아직 답변이 달리지 않았습니다.</h3>
                                        <p>죄송합니다. 빠른 시일 내에 답변 드리겠습니다.</p>
                                    </div>
                                }
                                    <button style={{color : 'red'}} onClick={handleClickClose}>닫기</button>
                                </UserInputSection2>
                                </div>
                            );
                        })
                    ) : (
                        <li>게시글이 없습니다.</li>
                    )}
                </ul>
            </QuestionList>
        </Area>
    );
};

const UserInputSection2 = styled.div`
    width: 90%;
    height: 20%;
    margin-left: 100px;
    display : flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid white;
    border-left: 1px solid white;
    border-radius: 5px;
    h3{
        margin-left : 15px;
    }
    
    p{
        margin-left : 15px;
        margin-bottom : 0px;
    }

    button {
        background-color: rgba(27, 25, 25, 0.7);
        color: #01CD9A;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s ease;
        padding: 10px;
        font-size : 200;
        width: 75px;
        height: 43px;
        margin-left: 5px;
        margin-top : 40px;
        margin-bottom : 10px;
        &:hover {
            transform: scale(1.05);
        }
    }
`;

export default MyQuestionList;
