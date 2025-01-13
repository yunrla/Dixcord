import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import '../../../Css/IconBtnCss.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalRegister from './ModalRegister';

function Register(props) {

    // 가입 유저 정보
    const [registerUser, setRegisterUser] = useState({
        userEmail : '',
        userPassword : '',
        userName : '',
        userNickName : '(미입력)',
        userIcon : '(미입력)',
        userPhone : '(미입력)',
        userBirthday : '',
        interest : []
    });

    const nav = useNavigate();
    // 체크박스 선택 유무
    const [checkbox, setCheckbox] = useState(false);

    const [regi, setRegi] = useState({
        userEmail : false,
        userPassword : false,
        userName : false,
        userBirthday : false
    });

    // 필수 정보 입력 확인
    const [registerState, setRegisterState] = useState(false);

    // 모달창 on/off 유무
    const [modalOnOff, setModalOnOff] = useState('none');
    // 인풋창 on/off 유무
    const [inputOnOff, setInputOnOff] = useState('flex');

    const [backgroundColor, setBackgroundColor] = useState('#686B72');

    const [xv, setXv] = useState('x');

    // 필수 정보들이 모두 기입됬을 때 true
    useEffect( () => {
        if((regi.userEmail, regi.userPassword, regi.userName, regi.userBirthday) === true && checkbox === true){
            setRegisterState(true);
        }else {
            setRegisterState(false);
        }
    }, [registerUser, checkbox]);

    // 년월일 나타내기
    const [year, setYear] = useState(() => {
        const years = [];
        for (let i = 2024; i >= 1900; i--) {
          years.push(i);
        }
        return years;
      });

    const [month, setMonth] = useState(() => {
        const months = [];
        for (let i = 1; i <= 12; i++) {
            months.push(i);
        }
        return months;
      });

    const [day, setDay] = useState(() => {
        const days = [];
        for (let i = 1; i <= 31; i++) {
          days.push(i);
        }
        return days;
      });

    const [selectedYear, setSelectedYear] = useState("년");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [isOpenYear, setIsOpenYear] = useState(false);
    const [isOpenMonth, setIsOpenMonth] = useState(false);
    const [isOpenDay, setIsOpenDay] = useState(false);

    const toggleDropdownY = () => {
        setIsOpenYear(!isOpenYear);
    };
    const toggleDropdownM = () => {
        setIsOpenMonth(!isOpenMonth);
    };
    const toggleDropdownD = () => {
        if(selectedMonth !== ""){
            setIsOpenDay(!isOpenDay);
        }else {
            return;
        }
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setIsOpenYear(false);
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setIsOpenMonth(false);
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setIsOpenDay(false);
    };

    // 입력값 저장
    const handleOnchagneInput = (e) => {
        const {name, value} = e.target;
       
        // 이메일 정규식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (name === "userEmail") {
            if (!emailRegex.test(value)) {
                document.querySelector('#emailFail1').style.display = 'block';
                document.querySelector('#emailCheck').style.display = 'contents';
                setRegi(prev => ({
                    ...prev,
                    userEmail : false
                }));
            } else {
                document.querySelector('#emailFail1').style.display = 'none';
                document.querySelector('#emailCheck').style.display = 'none';
                setRegi(prev => ({
                    ...prev,
                    userEmail : true
                }));
            }
        }

        if(name === "userPassword" && value.length < 4){
            document.querySelector('#passwordFail').style.display = 'block';
            document.querySelector('#passwordCheck').style.display = 'contents';
            setRegi(prev => ({
                ...prev,
                userPassword : false
            }));
        }else if(name === "userPassword" && value.length >= 4){
            document.querySelector('#passwordFail').style.display = 'none';
            document.querySelector('#passwordCheck').style.display = 'none';
            setRegi(prev => ({
                ...prev,
                userPassword : true
            }));
        }

        if(name === "userName" && value.length < 2){
            document.querySelector('#nameFail').style.display = 'block';
            document.querySelector('#nameCheck').style.display = 'contents';
            setRegi(prev => ({
                ...prev,
                userName : false
            }));
        }else if(name === "userName" && value.length >= 2){
            document.querySelector('#nameFail').style.display = 'none';
            document.querySelector('#nameCheck').style.display = 'none';
            setRegi(prev => ({
                ...prev,
                userName : true
            }));
        }


        setRegisterUser(prev => ({
            ...prev,
            [name] : value
        }));
    }

    // 필수 체크
    const handleChecked = (e) => {
        if(e.target.checked){
            setCheckbox(true);
            document.querySelector('#checkboxCheck').style.display = 'none';
        }else {
            setCheckbox(false);
            document.querySelector('#checkboxCheck').style.display = 'contents';
        }
    }

    // 입력 날짜 저장
    useEffect( () => {
        if(selectedDay !== ""){
            // db에 저장할수있는 date.sql 형태로 저장
            let finalDate = `${selectedYear}-${selectedMonth >= 10 ? selectedMonth : '0' + selectedMonth}-${selectedDay >= 10 ? selectedDay : '0' + selectedDay}`;
            document.querySelector('#birthdayCheck').style.display = 'none';
            setRegisterUser(prev => ({
                ...prev,
                userBirthday : finalDate
            }));
            setRegi(prev => ({
                ...prev,
                userBirthday : true
            }));
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    // 가입 진행
    const handleClickJoin = async () => {
        if(registerState === false){
            alert('필수 정보는 모두 입력해 주세요.');
            return;
        }

        const result = await axios.post('/user/api/register', registerUser);
        if(result.data === 'emailCheckFail'){
            document.querySelector('#emailFail3').style.display = 'block';
        }else if(result.data === 'Join Success'){
            alert('가입이 완료되었습니다.');
            nav('/');
        }else {
            alert('다시 시도해주세요.');
            return;
        }
    }

    // 모달 창 열기
    const handleOpenModal = () => {
        setModalOnOff('flex');
        setInputOnOff('none');
    }

    // 관심사 중복제거
    useEffect(() => {
        setRegisterUser((prev) => {
            const uniqueInterests = prev.interest.filter(
                (value, index, self) =>
                    index === self.findIndex((item) => item.interest === value.interest)
            );
    
            if (uniqueInterests.length === prev.interest.length) {
                return prev; // 중복이 없으면 상태 변경 안 함
            }
    
            return {
                ...prev,
                interest: uniqueInterests,
            };
        });
    }, [registerUser.interest]);
    
    // 유저 별명이 빈값으로 변경되면 미입력으로 다시 초기화
    useEffect( () => {
        if(registerUser.userNickName === ''){
            setRegisterUser(prev => ({
                ...prev,
                userNickName : '(미입력)'
            }));
        }
    }, [registerUser.userNickName]);

    useEffect( () => {
        if(inputOnOff === 'flex'){
            if(registerUser.userNickName === '(미입력)' && registerUser.userPhone === '(미입력)' && registerUser.interest.length === 0){
                setBackgroundColor('#686B72');
                setXv('X');
            }else {
                setXv('V');
            }
        }
    }, [inputOnOff]);

    return (
        <Container>
            <InputArea style={{display : inputOnOff}}>
                <RegisterDiv>
                    <h2>계정 만들기</h2>
                    <UserInputSection>
                        <p>이메일 <RedStarSpan id='emailCheck'>*</RedStarSpan><RedStarSpan id='emailFail3' style={{display : 'none'}}> - 이미 등록된 이메일이에요</RedStarSpan></p>
                        <input type="text" name="userEmail" value={registerUser.userEmail} onChange={handleOnchagneInput}/>
                    </UserInputSection>
                    <RedStarSpan id='emailFail1' style={{display : 'none', marginRight : '160px'}}>이메일 형식이 올바르지 않습니다.</RedStarSpan>
                    <RedStarSpan id='emailFail2' style={{display : 'none', marginRight : '160px'}}>중복된 이메일 입니다.</RedStarSpan>
                    <UserInputSection>
                        <p>비밀번호 <RedStarSpan id='passwordCheck'>*</RedStarSpan></p>
                        <input type="password" name="userPassword" value={registerUser.userPassword} onChange={handleOnchagneInput}/>
                    </UserInputSection>
                    <RedStarSpan id='passwordFail' style={{display : 'none', marginRight : '118px'}}>비밀번호가 너무 짧습니다. ( 최소 4글자 )</RedStarSpan>
                    <UserInputSection>
                        <p>이름 <RedStarSpan id='nameCheck'>*</RedStarSpan></p>
                        <input type="text" name="userName" value={registerUser.userName} onChange={handleOnchagneInput} maxLength={10}/>
                    </UserInputSection>
                    <RedStarSpan id='nameFail' style={{display : 'none', marginRight : '150px'}}>이름이 너무 짧습니다. ( 최소 2글자 )</RedStarSpan>
                    <UserInputSection>
                        <p>생년월일 <RedStarSpan id='birthdayCheck'>*</RedStarSpan></p>
                        <DateBox>
                            <DropdownBox>
                                <SelectedItem onClick={toggleDropdownY}>{selectedYear}</SelectedItem>
                                <DropdownList isOpen={isOpenYear}>
                                {year.map((y) => (
                                    <DropdownItem key={y} onClick={() => handleYearSelect(y)}>
                                    {y}
                                    </DropdownItem>
                                ))}
                                </DropdownList>
                            </DropdownBox>
                            <DropdownBox>
                                <SelectedItem onClick={toggleDropdownM}>{selectedMonth}월</SelectedItem>
                                <DropdownList isOpen={isOpenMonth}>
                                {month.map((m) => (
                                    <DropdownItem key={m} onClick={() => handleMonthSelect(m)}>
                                    {m}월
                                    </DropdownItem>
                                ))}
                                </DropdownList>
                            </DropdownBox>
                            <DropdownBox>
                                <SelectedItem onClick={toggleDropdownD}>{selectedDay}일</SelectedItem>
                                <DropdownList isOpen={isOpenDay}>
                                {day.map((d) => (
                                    <DropdownItem key={d} onClick={() => handleDaySelect(d)}>
                                    {d}
                                    </DropdownItem>
                                ))}
                                </DropdownList>
                            </DropdownBox>
                        </DateBox>
                    </UserInputSection>
                    <UserPlusDataSection>
                        <ModalRegisterOpen onClick={handleOpenModal} style={{marginRight : '10px'}}>(선택)추가 정보 입력하기</ModalRegisterOpen>
                        <span style={{backgroundColor : backgroundColor}}>{xv}</span>
                    </UserPlusDataSection>
                    <UserCheckSection>
                        <input type="checkbox" name="checkdAll" value="" onChange={handleChecked}/>
                        <p>개인 정보 동의 <RedStarSpan id='checkboxCheck'>*</RedStarSpan></p>
                    </UserCheckSection>
                </RegisterDiv>
                <BtnDiv>
                    <BtnSection>
                        <button className='loginBtn' onClick={handleClickJoin}>계속하기</button>
                    </BtnSection>
                    <LinkSection>
                        <Link to={'/login'} style={{color : '#01CD9A'}}>이미 계정이 있으신가요?</Link>
                    </LinkSection>
                </BtnDiv>
            </InputArea>
            <MoadlArea style={{display : modalOnOff}}>
                <ModalRegister user={setRegisterUser} modalDisplay={setModalOnOff} inputDisplay={setInputOnOff} setBackgroundColor={setBackgroundColor}/>
            </MoadlArea>
        </Container>
    );
}

const Container = styled.div`
    margin-left: 15%;
    margin-right: 15%;
    display: flex;
    justify-content: center;
    height: 800px;
`;

const InputArea = styled.div`
    width: 500px;
    height: 750px;
    margin-top: 3%;
    display: flex;
    border-radius: 4px;
    flex-direction: column;
    align-items: center;
    background-color: #3C3E43;
    color: white;
    `;

const MoadlArea = styled.div`
    margin-top: 3%;
    width: 500px;
    height: 750px;
    display: flex;
    border-radius: 4px;
    flex-direction: column;
    align-items: center;
    background-color: #3C3E43;
    color: white;
`;

const RegisterDiv = styled.div`
    margin: 15px;
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
const UserPlusDataSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 40%;
    span{
            display: inline-block; /* 크기를 설정할 수 있도록 변경 */
            width: 15px; /* 원하는 원 크기 */
            height: 15px; /* 너비와 동일하게 설정 */
            border-radius: 50%; /* 완전한 원으로 만듦 */
            text-align: center; /* 텍스트 가운데 정렬 */
            line-height: 15px; /* 텍스트를 수직 중앙에 정렬 */
            background-color: #686B72;
            font-size: 10px;
            &:hover{
                cursor: default;
            }
        }
`;
const UserCheckSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 60%;
    span{
        color: red;
    }
`;
const BtnDiv = styled.div`
    margin: 5px;
    margin-top: 80px;
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
        /* background-color: #5865F2; */
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

const RedStarSpan = styled.span`
    color: red;
`;

const DropdownBox = styled.div`
  position: relative;
  width: 127px;
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

const ModalRegisterOpen = styled.p`
    color: #01CD9A;
    &:hover {
        cursor: pointer;
    }
`;

export default Register;