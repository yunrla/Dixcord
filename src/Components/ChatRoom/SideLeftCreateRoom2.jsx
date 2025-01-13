import React, { useState } from 'react';
import styled from 'styled-components';
import SideLeftCreateRoom3 from './SideLeftCreateRoom3';
import SideLeftCreateRoom4 from './SideLeftCreateRoom4';

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
    color: #e0e0e0;
`;

const Container = styled.div`
    text-align: center;
    border-radius: 1%;
    padding: 20px;
    margin: 0 auto;
    width: 600px;
    overflow-y:auto;
    height: 600px;
    position: relative;
    background-color: rgba(42, 42, 42, 0.8); 
    z-index: 1000; 
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.2);  
    `
const Header = styled.header`
    padding-top: 10px;
    p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }
    `
const H2 = styled.h2`
    `

const Body = styled.div`
        
    `

const Section = styled.section`
            color: #e0e0e0;
    font-weight: bold; /* 굵은 글씨 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); /* 텍스트 그림자 추가 */

    &:hover {
        color: #01CD9A; /* 호버 시 포인트 색상 */
    }
    `
const Div = styled.div``;
const Button = styled.button`
    color: #e0e0e0;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 200px; /* 고정된 버튼 너비 */
    height: 150px; /* 고정된 버튼 높이 */

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 179, 108, 0.4); 

    }
`;
const Button2 = styled.button`
    background-color: rgba(42, 42, 42, 0.8); 
    color: #01CD9A;
    padding: 10px;
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {   
        transform: scale(1.05);
    }
`;


const Img = styled.img`
    width:100px;
    height: 100px;
    object-fit: cover;
    

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

const Footer = styled.div`
    padding: 20px;
    border: none;
    background: none;
`


function SideLeftCreateRoom2({ data, create2, setCreate2, create1, category }) {

    const [creatRoom4, setCreateRoom4] = useState(false);

    const handleModalClose = () => {
        setCreate2(false);
    }

    const handleDetailClick = () => {
        setCreate2(false);
        setCreateRoom4(true);
    }

    const goBack = () => {
        setCreate2(false);
        create1(true);
    }


    return (
        <>
            <Wrapper style={create2 === true ? { display: 'flex' } : { display: 'none' }}>
                <Container>
                    <Header>
                        <Span onClick={handleModalClose}>&times;</Span>
                        <H2>이 방에 대해 더 자세히 설명해주세요</H2>
                        <p>설정을 돕고자 질문을 드려요. </p>
                        <p>혹시 개설하는 방이 친구 몇 명만을 위한 방인가요,</p>
                        <p>아니면 더 큰 커뮤니티를 위한 방인가요? </p><br />
                    </Header>
                    <Body>
                        <Div>
                            <Button onClick={handleDetailClick}>
                                <Section><Img src="\images\yoon\club.png" alt="club" /></Section>
                                <Section>클럽, 혹은 커뮤니티용 방</Section>
                            </Button>
                        </Div>
                        <Div>
                            <Button onClick={handleDetailClick}>
                                <Section><Img src="\images\yoon\friend.png" alt="meAndFriend" /></Section>
                                <Section>나와 친구들을 위한 방</Section>
                            </Button>
                        </Div>
                    </Body>
                    <Footer>
                        <Button2 onClick={goBack}>뒤로가기</Button2>
                    </Footer>

                </Container>
            </Wrapper>
            <SideLeftCreateRoom4 create4={creatRoom4} setCreate4={setCreateRoom4} data={data} create2={setCreate2} category={category} />

        </>
    );
}

export default SideLeftCreateRoom2;