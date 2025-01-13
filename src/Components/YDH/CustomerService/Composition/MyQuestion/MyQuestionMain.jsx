import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import ServiceSearch from '../../ServiceSearch';
import { useNavigate } from 'react-router-dom';
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
    color: white;
`;

const HeaderContainer = styled.div`
    border-bottom: 2px solid #828282; /* 상단 경계선 */
    height: 10%;
`;

const LeftSidePull = styled.div`
    border: 1px dashed white;
    width: 0px;
    position: absolute;
    height: 82.5%;
    left: 19px;
    margin-top: 65px;
`;

const MyQuestion = styled.div`
    margin-left: 90px;
    margin-right: 250px;
    margin-top: 40px;
    position: relative;

    .container {
        padding-left: 5px;
        padding-right: 5px;
        margin: 0;
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        justify-content: left;
        width: 100%;
        overflow: hidden; /* 접히는 효과 적용 */
        transition: height 0.9s ease; /* 애니메이션 */
    }

    span {
        text-decoration: none;
        box-sizing: border-box;
    }

    .container-li {
        background: #252526;
        padding: 5px;
        width: 120px;
        height: 120px;
        margin: 10px;
        color: #ccc;
        text-align: center;
        border: 1px solid #F6F6F6;
        cursor: pointer;
        transition: border 0.3s ease; /* 부드러운 전환 효과 */
    }

    .container-li h3 {
        font-size: 0.9rem;
        color: #D9D9D9;
        margin-top: 80px;
    }

    .container-li.selected {
        border: 2px solid #01CD9A; /* 선택된 항목의 테두리 색상 */
    }

    .data-save {
        background-image: url(/images/ydh/icon/img_direct_messaging.svg); // 임의 아이콘
        background-repeat: no-repeat;
        background-size: 53px;
        background-position: center 14px;
    }

    .account {
        background-image: url('/images/ydh/icon/img_server_setuo.svg'); // 임의 아이콘
        background-repeat: no-repeat;
        background-size: 53px;
        background-position: center 14px;
    }

    .tech {
        background-image: url('/images/ydh/icon/01HZPN9V9NQBT2SQ3M1Z4BCTKC.svg'); // 임의 아이콘
        background-repeat: no-repeat;
        background-size: 53px;
        background-position: center 14px;
    }

    .selected-category {
        margin-top: 10px;
        margin-left: 70px;
        font-size: 1rem;
        position: relative;
        span{
            position: absolute;
            top: 15%;
        }
    }
    .change-selection {
        padding: 5px;
        color: #01CD9A;
        border: none;
        cursor: pointer;
    }
    
`;

const HeaderSectionOne = styled.div`
    display: flex;
    flex-direction: row;
    div{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        margin-top: 25px;
        margin-bottom: 20px;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid white;
        span{
            display: inline-block;
            width: 15px;
            height: 15px;
            background-color: #D9D9D9;
            border-radius: 50%;
        }
    }
`;

const MyQuestion2 = styled.div`
    margin-left: 90px;
    margin-right: 250px;
    position: relative;

    .anNae {
        background-color: #848486;
        width: 450px;
        text-align: center;
        border-radius: 40px;
        margin-bottom: 20px;
        border-bottom-left-radius: 0px;
    }
        
    .content {
        width: 500px;
        height: 250px;
        background-color: #252526;
        color: white;
    }

    .reset-selection {
    display: block;
    margin-top: 10px;
    margin-left: 75px;
    color: #01CD9A;
    cursor: pointer;
    }
    
    button.send {
        padding: 5px 40px;
        margin-top: 10px;
        width: 120px;
        background-color: #01CD9A;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button.send:hover {
        background-color: rgb(2, 163, 123);
    }
`;

const TextAreaHide = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 40px;
    transition: max-height 0.5s ease;
    overflow: hidden;
    max-height: ${({ isCollapsed }) => (isCollapsed ? '0' : '500px')};
`;

const MyQuestion3 = styled.div`
    margin-left: 90px;
    margin-right: 250px;
    position: relative;
`;

function MyQuestionMain({ data, setSideBarStatus }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);  // textarea 접힘 상태
    const [isTextAreaCollapsed, setIsTextAreaCollapsed] = useState(false);  // 텍스트 영역 접힘 상태
    const containerRef = useRef(null);
    const [lodding, setLodding] = useState(false);
    const [successFull, setSuccessFull] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.style.height = isCollapsed ? '0px' : `${container.scrollHeight}px`;
        }
    }, [isCollapsed]);

    useEffect( () => {
            setSideBarStatus('service');
        }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCategory(category);
        setIsCollapsed(true);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
        if (!category || !content) {
            alert('카테고리와 내용을 모두 입력해주세요.');
            return;
        }

        const inquiryData = {
            userCode: data.userCode,
            userName: data.userName,
            category,
            content,
        };
        setIsTextAreaCollapsed(true); // TextAreaHide 컴포넌트 접기
        setIsCollapsed(true); // reset-selection 표시
        setLodding(true);

        try {
            const response = await axios.post('/inquiry', inquiryData);
            if (response.status === 200) {

            }
        } catch (error) {
        }

    };

    const handleResetSelection = () => {
        setSelectedCategory('');
        setIsCollapsed(false);
    };

    const handleTextAreaReset = () => {
        setIsTextAreaCollapsed(false);
    };

    const mainService = () => {
        nav('/service');
    };

    const qwerasfd = () => {
        nav('/mypage');
    };

    const categoryImages = {
        '데이터 보호': '/images/ydh/icon/img_direct_messaging.svg',
        '계정 관리': '/images/ydh/icon/img_server_setuo.svg',
        '컴퓨터/기술': '/images/ydh/icon/01HZPN9V9NQBT2SQ3M1Z4BCTKC.svg',
    };

    const toggleTextArea = () => {
        setIsTextAreaCollapsed((prevState) => !prevState);
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            setIsTextAreaCollapsed(true); // 엔터키를 누르면 접기
        }
    };

    useEffect( () => {
        if(lodding){
            setTimeout(() => {
                setLodding(false);
                setSuccessFull(true);
            }, 1500);
        }
    }, [lodding]);

    const goToQuestions = () => {
        nav(`/mypage/myquestions/${data.userCode}`);
    };

    return (
        <Area className='backgCon' isCollapsed={isTextAreaCollapsed}>
            <HeaderContainer>
                <ServiceSearch />
            </HeaderContainer>
            <MyQuestion>
                <LeftSidePull style={isCollapsed ? {height : '82%', marginTop : '53px'} : {height : '82%'}}></LeftSidePull>
                <HeaderSectionOne>
                    <div style={isCollapsed ? {width : '25px', height : '25px', marginLeft : '6.5px'} : {}}>
                        {isCollapsed ? <span></span> : null}
                    </div>
                    <h1 style={{marginLeft : '30px', marginTop : '17px'}}>무엇을 도와드릴까요?</h1>
                </HeaderSectionOne>
                <section className="category" style={{marginLeft : '25px'}}>
                    <ul className="container" ref={containerRef}>
                        <li
                            className={`container-li data-save ${
                                selectedCategory === '데이터 보호' ? 'selected' : ''
                            }`}
                            onClick={() => handleCategoryClick('데이터 보호')}
                        >
                            <h3>데이터 보호</h3>
                        </li>
                        <li
                            className={`container-li account ${
                                selectedCategory === '계정 관리' ? 'selected' : ''
                            }`}
                            onClick={() => handleCategoryClick('계정 관리')}
                        >
                            <h3>계정 관리</h3>
                        </li>
                        <li
                            className={`container-li tech ${
                                selectedCategory === '컴퓨터/기술' ? 'selected' : ''
                            }`}
                            onClick={() => handleCategoryClick('컴퓨터/기술')}
                        >
                            <h3>컴퓨터/기술</h3>
                        </li>
                    </ul>
                </section>
                {isCollapsed && category && (
                    <div className="selected-category">
                        <img
                            src={categoryImages[category]}
                            alt={`${category}`}
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <span>{category}</span>
                        {successFull ? <section className="change-selection" style={{cursor : 'auto', color : 'silver'}}>
                        고객님의 의견을 적극 수용하겠습니다.
                    </section> : <section className="change-selection" onClick={handleResetSelection}>
                            선택 변경
                        </section>}
                    </div>
                )}
            </MyQuestion>
            <MyQuestion2>
                <LeftSidePull style={isTextAreaCollapsed ? {height : '77%', marginTop : '53px'} : {height : '90%'}}></LeftSidePull>
                <HeaderSectionOne>
                <div style={isTextAreaCollapsed ? {width : '25px', height : '25px', marginLeft : '6.5px'} : {}}>
                        {isTextAreaCollapsed ? <span></span> : null}
                    </div>
                    <h1 style={{marginLeft : '30px', marginTop : '17px'}}>겪고 계신 문제에 대해 알려주세요</h1>
                </HeaderSectionOne>
                <TextAreaHide isCollapsed={isTextAreaCollapsed}>
                    <section className="anNae">
                        이 문제를 해결하는데 도움이 될 만한 자원을 알아보겠습니다.
                    </section>
                    <textarea
                        className="content"
                        placeholder="문제를 상세하게 설명해주시기 바랍니다."
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleEnterKey}
                        style={{ resize: 'none' }}
                    ></textarea>
                    <button className="send" onClick={handleSubmit}>
                        전송
                    </button>
                </TextAreaHide>

                {successFull ? <section className="reset-selection" style={{cursor : 'auto', color : 'silver'}}>
                        소중한 의견 감사합니다.
                    </section> : isTextAreaCollapsed && (
                    <section className="reset-selection" onClick={handleTextAreaReset}>
                        다시 선택
                    </section>
                )}
                <br />
                {/* <button onClick={qwerasfd}>임의 리스트 확인 버튼</button> */}
            </MyQuestion2>
            {isTextAreaCollapsed && <MyQuestion3>
                <HeaderSectionOne>
                    <div style={{width : '50px', height : '50px', marginLeft : '-5.7px'}}>
                        <span style={{width : '35px', height : '35px', backgroundColor : '#01CD9A'}}></span>
                    </div>
                    <h1 style={{marginLeft : '20px', marginTop : '27px'}}>문의해 주셔서 감사합니다.</h1>
                </HeaderSectionOne>
                {/* <img src="http://192.168.0.140/uploadImg/icon/dixcordLogo2.png" alt="" width={'150px'} style={{marginLeft : '200px', borderRadius : '50%'}}/> */}
                <ButtonSection>
                    <button onClick={mainService}>고객센터 홈</button>
                    <button onClick={goToQuestions}>내 문의내역</button>
                </ButtonSection>
            </MyQuestion3>}
            {lodding &&
            <LoddingDiv className="modal-overlay">
                    <Lodding className="loading-bar"></Lodding>
            </LoddingDiv>}
        </Area>
    );
}

const LoddingDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 배경 색상 */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
    z-index: 9999;
`;

const Lodding = styled.div`
    border: 5px solid #f3f3f3; /* 회색 배경 */
    border-top: 5px solid #3498db; /* 파란색 로딩 부분 */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite; /* 회전 애니메이션 */
    margin: 0 auto;

    @keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
`;

const ButtonSection = styled.div`
    margin-top: 8%;
    button{
        border-radius: 4px;
        border: none;
        width: 12%;
        height: 37px;
        margin: 7px;
        color: white;
        font-weight: 540;
        font-size: 1rem;
        background-color: #01CD9A;
        transition : 0.7s;
        transition: background-image 0.5s ease; /* 자연스러운 전환 */
        cursor: pointer;
    }
`;

export default MyQuestionMain;