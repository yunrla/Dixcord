import React, { useState } from 'react';
import styled from 'styled-components';
import Display from '../Display/Display';
import SideLeftCreateRoom2 from './SideLeftCreateRoom2';
import SideLeftCreateRoom3 from './SideLeftCreateRoom3';


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
        padding: 30px;
        margin: auto;
        width: 500px;
        overflow-y:auto;
        height: 650px;
        position: relative;
        background-color: rgba(42, 42, 42, 0.8);  
        z-index: 1000;
        border-radius: 1%; /* 더 부드러운 모서리 */   
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.2);

   `
const Header = styled.div`
 p {
        margin: 0; /* 기본 마진 제거 */
        line-height: 1.4; /* 줄 간격 설정 */
    }   
    `
const H1 = styled.h1``;
const H3 = styled.h3`

`;
const Body = styled.div`
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4열 그리드 */
    gap: 10px; /* 버튼 간격 */
`;
const Div = styled.div``;
const Button = styled.button`
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(0, 179, 108, 0.3), 0 12px 30px rgba(0, 179, 108, 0.2); /* 그림자 크기 및 퍼짐 정도 증가 */

    }

    &:focus {
        outline: none; /* 포커스 시 테두리 없애기 */
    }
`;
const Button2 = styled.button`
    background-color: rgba(248, 244, 244, 0.1);
    color: #01CD9A;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
    &:hover {
        transform: scale(1.05);
    }
`;


const Section = styled.section`
    color: #e0e0e0;
    font-weight: bold; /* 굵은 글씨 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); /* 텍스트 그림자 추가 */
    `
const Footer = styled.footer`
        
    `
const Image = styled.img`
        width: 80px; /* 원하는 너비 */
        height: 80px; /* 원하는 높이 */
        object-fit: cover; /* 이미지 비율 유지 */
  `;

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


function SideLeftCreateRoom1({ data, create, create1, goBack, roomNumber, setRoomNum, ws, create3, setCreate3, setBackStatus  }) {

    const [creatRoom2, setCreateRoom2] = useState(false);



    const [category, setCategory] = useState('');
    



    const categories = [
        { name: '게임', image: '/images/yoon/game.png', alt: 'Game' },
        { name: '음악', image: '/images/yoon/music.png', alt: 'Music' },
        { name: '프로젝트', image: '/images/yoon/project.png', alt: 'Project' },
        { name: '교육', image: '/images/yoon/education.png', alt: 'Education' },
        { name: '엔터테인먼트', image: '/images/yoon/entertainment.png', alt: 'Entertainment' },
        { name: '음식', image: '/images/yoon/eat.png', alt: 'Food' },
        { name: '여행', image: '/images/yoon/airport.png', alt: 'Trip' },
        { name: '경제', image: '/images/yoon/economy.png', alt: 'Economy' }
    ];


    const handleModalClose = () => {
        create1(false);
    }

    const selectCategory = (e) => {

        if (!e.currentTarget.name) {
            alert('카테고리를 선택해주세요!');

            return;
        } else {
            create1(false);
            setCategory(e.currentTarget.name);
            setCreateRoom2(true);
        }

    }

    const isInvited = () => {
        create1(false);
        setCreate3(true);
        setBackStatus(true);
    }





    return (
        <>
            <Wrapper style={create === true ? { display: 'flex' } : { display: 'none' } && goBack === true ? { display: 'flex' } : { display: 'none' }}>
                <Container>
                    <Header>
                        <Span onClick={handleModalClose}>&times;</Span>
                        <H1>방을 만들어보세요</H1>
                        <p>나와 친구들이 함께 어울리는 공간입니다.</p>
                        <p> 내 채널을 만들고 대화를 시작해 보세요!</p><br />
                        <H3>카테고리 선택하기</H3>
                    </Header>
                    <Body>

                        {categories.map((cat, index) => (
                            <Div key={index}>
                                <Button name={cat.name} onClick={selectCategory}>
                                    <Section>
                                        <Image src={cat.image} alt={cat.alt}></Image>
                                    </Section>
                                    <Section>
                                        {cat.name}
                                    </Section>
                                </Button>
                            </Div>
                        ))}

                    </Body>
                    <Footer>
                        <h2>이미 초대장을 받으셨나요?</h2>
                        <Button2 onClick={isInvited}> 방 들어가기 </Button2>
                    </Footer>
                </Container>
            </Wrapper>
            <SideLeftCreateRoom2 create2={creatRoom2} setCreate2={setCreateRoom2} data={data} create1={create1} category={category} setCategory={setCategory} />
            <SideLeftCreateRoom3 create3={create3} setCreate3={setCreate3} create1={create1} data={data} setRoomNum ={setRoomNum} ws={ws}/>

        </>
    ); 
}

export default SideLeftCreateRoom1;