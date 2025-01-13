import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SideBarRightArea from '../ChatRoom/SideBarRightArea';

const Container = styled.div`
    display: flex;
    height: 100%;
`;

const Circle = styled.div`
    width: 60px;
    height: 60px;
    display: flex; 
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
`

const Circle1 = styled(Circle)`
    background-image: url('//192.168.0.140/uploadImg/icon/dixcordLogoWhite.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 60px;
    margin-top: 30px;
    margin-bottom: 70px;
    background-color: none;
`

const Circle2 = styled(Circle1)`
    width: 40px; 
    height: 40px;
    margin: 0 auto;
    background-image: url('//192.168.0.140/uploadImg/icon/room.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-bottom: 70px;
`
const Circle3 = styled(Circle1)`
    width: 40px; 
    height: 40px;
    margin: 0 auto;
    background-image: url('//192.168.0.140/uploadImg/icon/firend.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-bottom: 70px;
`
const Circle4 = styled(Circle1)`
    width: 50px; 
    height: 50px;
    margin: 0 auto;
    background-image: url('//192.168.0.140/uploadImg/icon/manager-profile.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-top: 30px;
    margin-bottom: 70px;
`

const Circle5 = styled(Circle1)`
    width: 40px; 
    height: 40px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('//192.168.0.140/uploadImg/icon/service.png');
    margin-bottom: 70px;
`
const Circle6 = styled(Circle1)`
    width: 40px; 
    height: 40px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('//192.168.0.140/uploadImg/icon/option.png');
    margin-bottom: 50%;
`
const Circle7 = styled(Circle1)`
    width: 50px; 
    height: 50px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('//192.168.0.140/uploadImg/icon/logout.png');
    margin-bottom: 30%;
`

const LeftSidebar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.bgColor || 'rgba(30, 31, 34, 0.7)'};
    border-radius: 20px;
    margin: 10px;
    width: 120px;
    align-items: center;
`;

const SidebarHeader = styled.div`
    display: flex;
    flex-direction: column;
    div:hover{
        cursor: pointer;
    }
`;

const SidebarFooter = styled.div`
    
    div:hover{
        cursor: pointer;
    }
`;

const DivLeft = styled.div`

`;

const DivRight = styled.div`

height: 100%;
`;

const RightSidebar = styled.div`
    background-color: ${({ theme }) => theme.bgColor || 'rgba(30, 31, 34, 0.7)'};
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    color: ${({ theme }) => theme.textColor};
`;

function Sidebar({ setMusicPlay, setWarnNkick, setRoomNumber, getUser, setSideBarStatus, sideBarStatus, setCurrentVideo,banWordList, setBanWordList, setChatbanstatus, ws, reloadState, setReloadState, refreshFriend, setRefreshFriend }) {

    const [roomNum, setRoomNum] = useState(0);
    const nav = useNavigate();
    
    const handleLinkClick = (e) => {
        const title = e.target.getAttribute('title');
        if(title === 'home'){
            setSideBarStatus('friend');
            nav('/');
            setRoomNumber(0);
            setRoomNum(0);
        }else if(title === 'friend'){
            setSideBarStatus('friend');
            nav('/friend');
            setRoomNumber(0);
            setRoomNum(0);
        }else if(title === 'room'){
            setSideBarStatus('room');
        }else if(title === 'admin'){
            setSideBarStatus('admin');
            nav('/adminMain');
        }else if(title === 'service'){
            setSideBarStatus('non');
            nav('/service');
        }else if(title === 'option'){
            setSideBarStatus('option');
        }else {
            nav('/logout');
        }
        
    }

    return (
        <Container>
            <LeftSidebar>
                <SidebarHeader>
                    <Circle1 title='home' onClick={handleLinkClick}></Circle1>
                    <Circle2 title='room' onClick={handleLinkClick}></Circle2>
                    <Circle3 title='friend' onClick={handleLinkClick}></Circle3>
                    <Circle5 title='service' onClick={handleLinkClick}></Circle5>
                    {
                    getUser.userAuth === 'ROLE_ADMIN' && 
                    <Circle4 title='admin' onClick={handleLinkClick}></Circle4>}
                </SidebarHeader>
                <SidebarFooter>
                    <Circle7 title='logout' onClick={handleLinkClick}></Circle7>
                </SidebarFooter>
            </LeftSidebar>
            {
                sideBarStatus === 'option' ? null 
            : 
                sideBarStatus === 'service' ? 
            <RightSidebar>
                <SideBarRightArea data={getUser} sideStatus={sideBarStatus} roomNumber={roomNum} rightSide={setSideBarStatus} setRoomNum={setRoomNum} setCurrentVideo={setCurrentVideo}></SideBarRightArea>
            </RightSidebar>
            :
                sideBarStatus === 'admin' ? 
            <RightSidebar>
                <SideBarRightArea data={getUser} sideStatus={sideBarStatus} roomNumber={roomNum} rightSide={setSideBarStatus} setRoomNum={setRoomNum} setCurrentVideo={setCurrentVideo}></SideBarRightArea>
            </RightSidebar>
            :
                sideBarStatus === 'room' ? 
            <RightSidebar>
                <SideBarRightArea setMusicPlay ={setMusicPlay} setWarnNkick={setWarnNkick} ws={ws} setReloadState={setReloadState} reloadState={reloadState} setChatbanstatus={setChatbanstatus} banWordList={banWordList} setBanWordList={setBanWordList} setRoomNumber={setRoomNumber} data={getUser} sideStatus={sideBarStatus} roomNumber={roomNum} rightSide={setSideBarStatus} setRoomNum={setRoomNum} setCurrentVideo={setCurrentVideo}></SideBarRightArea>
            </RightSidebar>
            :
                sideBarStatus === 'friend' ? 
            <RightSidebar>
                <SideBarRightArea data={getUser} sideStatus={sideBarStatus} roomNumber={roomNum} rightSide={setSideBarStatus} setRoomNum={setRoomNum} setCurrentVideo={setCurrentVideo} refreshFriend={refreshFriend} setRefreshFriend={setRefreshFriend}></SideBarRightArea>
            </RightSidebar>
            :
                sideBarStatus === 'non' ? 
            null 
            :
            <RightSidebar>
                <SideBarRightArea data={getUser} sideStatus={sideBarStatus} roomNumber={roomNum} rightSide={setSideBarStatus} setRoomNum={setRoomNum} setCurrentVideo={setCurrentVideo} refreshFriend={refreshFriend} setRefreshFriend={setRefreshFriend}></SideBarRightArea>
            </RightSidebar>
            }
        </Container>
    );
}

export default Sidebar;