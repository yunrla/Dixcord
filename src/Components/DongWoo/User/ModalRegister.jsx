import React, { createElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import '../../../Css/InterIcon.css';
import axios from 'axios';

const RegisterDiv = styled.div`
    margin: 15px;
    margin-bottom: 90px;
    width: 90%;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
        font-weight: 400;
        font-size: 14px;
    }
    input[type='text'], input[type='password']{
        width: 395px;
        height: 40px;
        background-color: #232428;
        border-radius: 4px;
        border: none;
        color: white;
        padding-left: 10px;
    }
    input[type='checkbox']{
        width: 24px;
        height: 24px;
        cursor: pointer;
        appearance: none; /* 기본 체크박스 스타일 제거 */
        border-radius: 5px; /* 둥글게 만들기 */
        border: 1px solid white; /* 테두리 설정 */
        transition: background-color 0.2s ease, border-color 0.2s ease;

        
        &:hover {
            border-color: #888;
        }
    }
    input[type='checkbox']:checked {
        background-color: #3c48cf;
        background-repeat: no-repeat;
        background-position: center;
    }
`;

const UserInputSection = styled.div`
    margin: 5px;
    width: 90%;
    height: 20%;
`;
const BtnDiv = styled.div`
    margin: 5px;
    width: 90%;
    height: 17%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const BtnSection = styled.div`
    width: 90%;
    button{
        border-radius: 4px;
        border: none;
        width: 100%;
        height: 44px;
        margin-top: 15px;
        background-image: linear-gradient(108.47038220091133deg, rgba(43, 240, 191,1) 30.898437499999996%,rgba(43, 240, 191,1) 34.371744791666664%,rgba(14, 227, 206,1) 56.68511284722222%,rgba(24, 198, 214,1) 81.41927083333333%);
        background-color: #5865F2;
        transition : 0.7s;
    }

    button:hover {
        cursor: pointer;
        transition : 0.7s;
        background-color: #3c48cf;
    }
`;
const LinkSection = styled.div`
    width: 90%;
    margin-top: 15px;
    a {
        color: #007AFF;
        text-decoration: none;
    }
`;

const UserInterenstSection = styled.div`
    margin: 5px;
    width: 90%;
    min-height: 200px;
    height: 40%;
`;

const DropdownBox = styled.div`
  position: relative;
  width: 480px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SelectedItem = styled.div`
  padding: 10px;
  background-color: #232428;
  cursor: default;
  font-size: 16px;
  text-align: center;
  border-radius: 4px;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: #232428;
  z-index: 10;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const DropdownItem = styled.div`
  padding: 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #6e6868;
  }
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RedStarSpan = styled.span`
    color: red;
`;

const HeaderSection = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    justify-content: center;
    div{
        position: absolute;
        right: 0%;
        span{
            display: inline-block; /* 크기를 설정할 수 있도록 변경 */
            width: 30px; /* 원하는 원 크기 */
            height: 30px; /* 너비와 동일하게 설정 */
            border-radius: 50%; /* 완전한 원으로 만듦 */
            text-align: center; /* 텍스트 가운데 정렬 */
            line-height: 30px; /* 텍스트를 수직 중앙에 정렬 */
            background-color: #5865F2;

            &:hover{
                cursor: pointer;
            }
        }
    }
`;

function ModalRegister({user, modalDisplay, inputDisplay, setBackgroundColor}) {

    // 관심사 목록
    const userInterest = ['게임', '음악', '프로젝트', '교육', '엔터테인먼트', '음식', '여행', '경제'];

    // 별명 중복체크
    const [userNickNameCheck, setUserNickNameCheck] = useState(true);

    // 토글 창 오픈
    const [isOpen, setIsOpen] = useState(false);

    // 별명, 전화번호 값 변경
    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        if(name === 'userNickName'){
            if(value === ''){
                setUserNickNameCheck(true);
                document.querySelector('#NickNameFail2').style.display = 'none';
            }else if(value.length < 2){
                setUserNickNameCheck(false);
                document.querySelector('#NickNameFail2').style.display = 'block';
            }else {
                document.querySelector('#NickNameFail2').style.display = 'none';
                axios.get(`/user/api/nickNameCheck?userNickName=${value}`)
                    .then(response => {
                        if(response.data === 'nickNameCheckFail'){
                            setUserNickNameCheck(false);
                            document.querySelector('#NickNameFail').style.display = 'contents';
                        }else if(response.data === 'success nickName'){
                            setUserNickNameCheck(true);
                            document.querySelector('#NickNameFail').style.display = 'none';
                            user(prev => ({
                                ...prev,
                                [name] : value
                            }));
                        }
                    })
                    .catch(err => console.log(err));
            }
        }else {
            user(prev => ({
                ...prev,
                [name] : value
            }));
        }
    }

    // 관심사 아이콘 클릭 handle
    const handleOnclickImg = (e) => {
        e.target.style.display = 'none';
        user(prev => ({
            ...prev,
            interest : [...prev.interest.filter(inter => inter.interest !== e.target.alt)]
        }));
    }

    // 관심사 선택
    const handleInterestSelect = (inter) => {
        user(prev => ({
            ...prev,
            interest : [...prev.interest, { interest : inter }]
        }));

        setIsOpen(false);

        if(inter === '게임'){
            document.querySelector('#gameIcon').style.display = 'inline';
        }else if(inter === '음악'){
            document.querySelector('#musicIcon').style.display = 'inline';
        }else if(inter === '프로젝트'){
            document.querySelector('#projectIcon').style.display = 'inline';
        }else if(inter === '교육'){
            document.querySelector('#educationIcon').style.display = 'inline';
        }else if(inter === '엔터테인먼트'){
            document.querySelector('#entertainmentIcon').style.display = 'inline';
        }else if(inter === '음식'){
            document.querySelector('#foodIcon').style.display = 'inline';
        }else if(inter === '여행'){
            document.querySelector('#travelIcon').style.display = 'inline';
        }else{
            document.querySelector('#economyIcon').style.display = 'inline';
        }
        
    }

    // 관심사 토글 열기
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    // 계속하기 버튼 이벤트
    const handleOnClickRegisterMove = () => {
        if(userNickNameCheck === false){
            alert('별명을 확인해주세요');
            return;
        }

        inputDisplay('flex');
        modalDisplay('none');
        setBackgroundColor('#34C759');
    }

    return (
        <>
            <RegisterDiv>
                <HeaderSection>
                    <h2>계정 만들기</h2>
                    <div>
                        <span onClick={handleOnClickRegisterMove}>X</span>
                    </div>
                </HeaderSection>
                <UserInputSection>
                    <p>닉네임 <RedStarSpan id='NickNameFail' style={{display : 'none'}}> - 중복된 닉네임이에요</RedStarSpan></p>
                    <input type="text" name="userNickName" onChange={handleChangeInput} maxLength={8}/>
                </UserInputSection>
                <RedStarSpan id='NickNameFail2' style={{display : 'none', marginRight : '140px'}}> 닉네임은 최소 2글자 이상이어야 합니다.</RedStarSpan>
                <UserInputSection>
                    <p>전화번호 <span style={{color : 'silver'}}>( - 제외 숫자만 입력 )</span></p>
                    <input type="text" name="userPhone" onChange={handleChangeInput}/>
                </UserInputSection>
                <UserInputSection>
                    <p>관심사</p>
                    <DateBox>
                        <DropdownBox>
                            <SelectedItem onClick={toggleDropdown}>관심사 선택</SelectedItem>
                            <DropdownList isOpen={isOpen}>
                                {userInterest.map((inter) => (
                                    <DropdownItem key={inter} onClick={() => handleInterestSelect(inter)}>
                                    {inter}
                                    </DropdownItem>
                                ))}
                            </DropdownList>
                        </DropdownBox>
                    </DateBox>
                </UserInputSection>
                <UserInterenstSection id='iconTab'>
                    <img id='gameIcon' className='interIcon' src="/images/game.png" alt="게임" onClick={handleOnclickImg}/>
                    <img id='musicIcon' className='interIcon' src="/images/music.png" alt="음악" onClick={handleOnclickImg}/>
                    <img id='projectIcon' className='interIcon' src="/images/project.png" alt="프로젝트" onClick={handleOnclickImg}/>
                    <img id='educationIcon' className='interIcon' src="/images/education.png" alt="교육" onClick={handleOnclickImg}/>
                    <img id='entertainmentIcon' className='interIcon' src="/images/entertainment.png" alt="엔터테인먼트" onClick={handleOnclickImg}/>
                    <img id='foodIcon' className='interIcon' src="/images/food.png" alt="음식" onClick={handleOnclickImg}/>
                    <img id='travelIcon' className='interIcon' src="/images/travel.png" alt="여행" onClick={handleOnclickImg}/>
                    <img id='economyIcon' className='interIcon' src="/images/economy.png" alt="경제" onClick={handleOnclickImg}/>
                </UserInterenstSection>
            </RegisterDiv>
            <BtnDiv>
                <BtnSection>
                    <button onClick={handleOnClickRegisterMove}>저장하기</button>
                </BtnSection>
            </BtnDiv>
        </>
    );
}

export default ModalRegister;