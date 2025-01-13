import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {styled} from 'styled-components';
import '../../Css/MainFont.css';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    margin-left: 3%;
    margin-right: 3%;
`;

const LogoArea = styled.div`
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    span{
        color: ${({ theme }) => theme.textColor};
        margin-left: 5px;
        font-size: 25px;
        letter-spacing : 3px;
        margin-bottom: 5px;
    }
    img{
        width: 30px;
        height: 30px;
    }
`;

const RightArea = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const BtnSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    img{
        width: 27px;
        height: 27px;
        border-radius: 50%;
        margin-right: 8px;
    }

    a{
        margin-left: 10px;
        text-decoration: none;
        color: black;
    }

    a:hover{
        font-size: 1.1em;
    }
`;

const UserState = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 30px;
    p{
        margin: 0;
        font-size: 12px;
        color: ${({ theme }) => theme.textColor};
    }
`;

const ImgState = styled.img`
    margin: 20px;
    cursor: pointer;
`;

const Circle = styled.div`
    width: 60px;
    height: 60px;
    display: flex; 
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    &:hover{
        
    }
`

const Circle4 = styled(Circle)`
    width: 23px; 
    height: 23px;
    margin: 30px;
    background-image: url('//192.168.0.140/uploadImg/icon/alter.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`

const SliderButtonContainer = styled.div`
    position: relative;
    width: 53px;
    height: 25px;
    background-color: ${(props) => (props.theme === 'dark' ? 'rgba(30, 31, 34)' : '#e5e5ea')};
    border-radius: 34px;
    transition: background-color 0.3s ease;
    cursor: pointer;
`;

const Slider = styled.div`
    position: absolute;
    top: 2px;
    left: ${(props) => (props.theme === 'dark' ? 'calc(100% - 22px)' : '2px')};
    width: 20px;
    height: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    transition: left 0.3s ease;
`;

const ToggleText = styled.span`
    position: absolute;
    top: 50%;
    left: ${(props) => (props.theme === 'dark' ? '10px' : '38px')};
    transform: translateY(-50%);
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    opacity: ${(props) => (props.theme === 'dark' ? 1 : 0)};
    transition: opacity 0.3s ease, left 0.3s ease;
`;


function Header({ data, theme, getTheme, setSideBarStatus }) {

    const nav = useNavigate();

    const [user, setUser] = useState(null); 
    
    useEffect( () => {
        if(data === null){
            nav('/');
        }else {
            setUser(data);
        }
    }, [data]);

    const handleLinkClick = () => {

    }

    return (
        <Container>
            <LogoArea onClick={() => {setSideBarStatus('friend');nav('/')}}>
                <img src="http://192.168.0.140/uploadImg/icon/dixcordLogoWhite.png" alt="" />
                <span>Dixcord</span>
            </LogoArea>
            {user !== null ? 
                <RightArea>
                    <SliderButtonContainer
                        onClick={theme}
                        theme={getTheme} 
                    >
                        <Slider theme={getTheme} />
                        <ToggleText theme={getTheme} ></ToggleText>
                    </SliderButtonContainer>
                    {/* <ImgState width="24" height="24" src="https://img.icons8.com/material-outlined/24/FFFFFF/appointment-reminders--v1.png" alt="appointment-reminders--v1" /> */}
                    {/* <Circle4 title='alert' onClick={handleLinkClick}></Circle4> */}
                    <BtnSection onClick={() => nav('/myPage')} style={{cursor : 'pointer'}}>
                        <img src={user.userIcon !== null ? "http://192.168.0.140/uploadImg/userImg/" + user.userIcon : '/images/userIcon'}
                            alt="22" name='userIcon' 
                            onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                        <UserState>
                            <p>{user.userNickName}</p>
                            {user.userState === '오프라인' ? <p style={{color : '#CBC7C7'}}>오프라인</p> : <p style={{color : '#01CD9A', fontSize : '10px'}}>온라인</p>}
                        </UserState>
                    </BtnSection>
                </RightArea>
                : <BtnSection>
                    <Link to={'/login'}>로그인</Link>
                    <Link to={'/register'}>회원가입</Link>
                    <Link to={'/service'}>고객센터</Link>
                </BtnSection>
            }
        </Container>
    );
}

export default Header;