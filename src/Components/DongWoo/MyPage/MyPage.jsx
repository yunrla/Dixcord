import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Confirm from '../../Alert/Confirm';
import Alert from '../../Alert/Alert';

function MyPage({getUser, setUser, setSideBarStatus}) {

    const [userData, setUserData] = useState(null);

    const [isUpdate, setIsUpdate] = useState(false);

    const [isSave, setIsSave] = useState(false);

    const nav = useNavigate();

    const [isCheck, setIsCheck] = useState({
        nickName : false,
        email : false,
        pw : false,
    });

    const [modalOpen, setModalOpen] = useState(false);

    const [userPassword, setUserPassword] = useState('');

    useEffect( () => {
        if(getUser !== null && userData === null){
            setUserData(getUser);
            setSideBarStatus('myPage')
        }
    }, [getUser]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        if(!isSave){
            setIsSave(true);
        }
        if(e.target.getAttribute('name') === 'backGroundImg'){
            const bgImg = document.querySelector('input[name="backGroundImg"]');
            bgImg.click();

            return;
        }else if(e.target.getAttribute('name') === 'userIcon'){
            document.querySelector('input[name="userIcon"]').click();
            return;
        }
        setUserData(prev => ({
            ...prev,
            [name] : value
        }));

    }

    const handleChangeInputFile = e => {
        if(e.target.name === 'backGroundImg'){
            const formData = new FormData();
            const uploadFile = e.target.files[0];
            formData.append("uploadFile", uploadFile);
            axios.post('/user/api/uploadFile', formData)
                .then(response => {
                    setUserData(prev => ({
                        ...prev,
                        backGroundImg : response.data
                    }))
                });
        }else if(e.target.name === 'userIcon'){
            const formData = new FormData();
            const uploadFile = e.target.files[0];
            formData.append("uploadFile", uploadFile);
            axios.post('/user/api/uploadFile', formData)
                .then(response => {
                    setUserData(prev => ({
                        ...prev,
                        userIcon : response.data
                    }))
                });
        }
    }

    const handleUpdateSave = async () => {
        // 데이터 저장하는 함수 실행 후 변경해주기
        // 1. 별명 변경 시 중복체크
        if(userData.userNickName !== getUser.userNickName){
            await axios.get('/user/api/nickNameCheck?userNickName=' + userData.userNickName)
                .then(response => {
                    if(response.data === 'success nickName'){
                        // 사용 가능한 별명
                        setIsCheck(prev => ({
                            ...prev,
                            nickName : false
                        }));
                    }else {
                        // 사용 불가능한 별명 알리기
                        setIsCheck(prev => ({
                            ...prev,
                            nickName : true
                        }));
                        return;
                    }
                });
        }
        // 2. 이메일 변경 시 중복체크 및 유효성 체크
        if(userData.userEmail !== getUser.userEmail){
            await axios.get('/user/api/emailCheck?userEmail=' + userData.userEmail)
                .then(response => {
                    if(response.data === 'success email'){
                        // 사용 가능한 이메일
                        setIsCheck(prev => ({
                            ...prev,
                            email : false
                        }));
                    }else {
                        // 사용 불가능한 별명 알리기
                        setIsCheck(prev => ({
                            ...prev,
                            email : true
                        }));
                        return;
                    }

                });
        }

        // 유저 아이콘 및 백그라운드 이미지가 null 이면 값 변경
        if(userData.userIcon === null){
            setUserData(prev => ({
                ...prev,
                userIcon : '(미입력)'
            }));
        }

        if(userData.backGroundImg === null){
            setUserData(prev => ({
                ...prev,
                backGroundImg : '(미입력)'
            }));
        }

        // 3. 닉네임 및 이메일이 통과되거나 변경사항이 없을 시 데이터 수정
        await axios.post('/user/api/userUpdateInfo', userData)
            .then(response => {
                if(response.data === 'success'){
                    // 업데이트 성공
                    setIsSave(false);
                    setIsUpdate(false);
                    setUser(userData);
                    alert('변경사항이 저장되었습니다.');
                    return;
                }else {
                    // 업데이트 실패
                    return;
                }
            });

    }

    const handleChangePw = e => {
        const {name, value} = e.target;
        if(name === 'userPassword'){
            setUserPassword(value);
        }else if (name === 'userPasswordCheck'){
            if(value !== userPassword){
                setIsCheck(prev => ({
                    ...prev,
                    pw : true
                }));
            }else {
                setIsCheck(prev => ({
                    ...prev,
                    pw : false
                }));
            }
        }
    }

    const handleUpdatePassword = () => {
        if(userPassword.length > 3 && userPassword === document.querySelector('input[name="userPasswordCheck"]').value){
            axios.post('/user/api/passwordUpdate', {userCode : userData.userCode, userPassword : userPassword})
                .then(response => {
                    if(response.data === 'success'){
                        alert('비밀번호 변경 완료');
                        setModalOpen(false);
                        return;
                    }else {
                        alert('다른 비밀번호를 입력 해 주세요');
                        return;
                    }
                });
        }else {
            alert('비밀번호를 다시 설정해주세요.');
        }
    }

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const handleDeleteUser = () => {
        setConfirmVisible(true);
    }
    
    const handleConfirm = () => {
        setConfirmVisible(false);
        axios.get(`/user/api/deleteUserData?userCode=${getUser.userCode}`)
            .then(response => {
                if(response.data === 'success'){
                    setAlertVisible(true);
                 } else {
                    alert('실패!')
                 }
            })
            .catch(err => {
                // console.log(err);
            });
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };
    
    const handleCancel2 = () => {
        setAlertVisible(false);
        nav('/logout');
    }


    return (
        <Container>
            {
                userData !== null &&
                <>
                {isUpdate ? <MainArea className='backgCon'>
                    <BackgRoundSection style={userData.backGroundImg !== null ? {backgroundImage : `url("http://192.168.0.140/uploadImg/userImg/${userData.backGroundImg}")`} : {backgroundImage : 'url("http://192.168.0.140/uploadImg/backgroundsample.jpg")'}} name='backGroundImg' onClick={handleChangeInput}>
                        <input type="file" name="backGroundImg" hidden onChange={handleChangeInputFile}/>
                    </BackgRoundSection>
                    <UserIconSection>
                        <img src={userData.userIcon !== null ? "http://192.168.0.140/uploadImg/userImg/" + userData.userIcon : '/images/userIcon'} 
                        alt="22" name='userIcon' onClick={handleChangeInput} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                        <input type="file" name="userIcon" hidden onChange={handleChangeInputFile}/>
                    </UserIconSection>
                    <UserInfoSection>
                        <UserInfoData>
                            <p>닉네임 <b style={isCheck.nickName ? {display : 'content'} : {display : 'none'}}> 중복된 닉네임입니다 다시 입력 해 주세요. </b></p>
                            <input type='text' name='userNickName' value={userData.userNickName} onChange={handleChangeInput}/>
                            <p>사용자명</p>
                            <UserName>{userData.userName}</UserName>
                            <p>이메일 <b style={isCheck.email ? {display : 'content'} : {display : 'none'}}> 중복된 이메일입니다 다시 입력 해 주세요. </b></p>
                            <input type='text' name='userEmail' value={userData.userEmail} onChange={handleChangeInput}/>
                            <p>전화번호</p>
                            <input type='text' name='userPhone' value={userData.userPhone} onChange={handleChangeInput}/>
                        </UserInfoData>
                        <PasswordUpdate onClick={() => setModalOpen(true)}>비밀번호 변경</PasswordUpdate>
                        <UserDataDelete>
                            <p>계정 제거</p>
                            <span onClick={handleDeleteUser}>계정 삭제</span>
                        </UserDataDelete>
                        {
                            isSave ? 
                            <UpdateDataSave>
                                <p>조심하세요! 저장하지 않은 변경사항이 있어요!</p>
                                <div>
                                    <p>재설정</p>
                                    <span onClick={handleUpdateSave}>변경사항 저장하기</span>
                                </div>
                            </UpdateDataSave>
                            :
                            null
                        }
                    </UserInfoSection>
                </MainArea>
                :
                <MainArea className='backgCon'>
                    <BackgRoundSection style={userData.backGroundImg !== null ? {backgroundImage : `url("http://192.168.0.140/uploadImg/userImg/${userData.backGroundImg}")`} : {backgroundImage : 'url("http://192.168.0.140/uploadImg/backgroundsample.jpg")'}} name='backGroundImg' onClick={handleChangeInput}>
                        <input type="file" name="backGroundImg" hidden onChange={handleChangeInputFile}/>
                    </BackgRoundSection>
                    <UserIconSection>
                        <img src={userData.userIcon !== null ? "http://192.168.0.140/uploadImg/userImg/" + userData.userIcon : '/images/userIcon'}
                        alt="22" name='userIcon' onClick={handleChangeInput} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "http://192.168.0.140/uploadImg/userImg/usericon.jpg";}}/>
                        <input type="file" name="userIcon" hidden onChange={handleChangeInputFile}/>
                    </UserIconSection>
                    <UserInfoSection>
                        <UpdateBtn onClick={() => setIsUpdate(true)}>수정</UpdateBtn>
                        <UserInfoData>
                            <p>닉네임</p>
                            <span>{userData.userNickName}</span>
                            <p>사용자명</p>
                            <span>{userData.userName}</span>
                            <p>이메일</p>
                            <span>{userData.userEmail}</span>
                            <p>전화번호</p>
                            <span>{userData.userPhone}</span>
                        </UserInfoData>
                        <PasswordUpdate onClick={() => setModalOpen(true)}>비밀번호 변경</PasswordUpdate>
                        <UserDataDelete>
                            <p>계정 제거</p>
                            <span onClick={handleDeleteUser}>계정 삭제</span>
                        </UserDataDelete>
                        {
                            isSave ? 
                            <UpdateDataSave>
                                <p>조심하세요! 저장하지 않은 변경사항이 있어요!</p>
                                <div>
                                    <p>재설정</p>
                                    <span onClick={handleUpdateSave}>변경사항 저장하기</span>
                                </div>
                            </UpdateDataSave>
                            :
                            null
                        }
                    </UserInfoSection>
                </MainArea>}
                <PasswordUpdateModal style={modalOpen ? {display : 'flex'} : {display : 'none'}} className='backgCon'>
                        <h2>비밀번호를 바꿔주세요.</h2>
                        <span>새 비밀번호를 입력하세요</span>
                        <div style={{marginTop : '5%'}}>
                            <span>비밀번호</span>
                            <input type="password" name="userPassword" onChange={handleChangePw} value={userPassword}/>
                        </div>
                        <div>
                            <span>비밀번호 확인 
                                <span style={isCheck.pw ? {display : 'contents', color : 'red'} : {display : 'none'}}> 비밀번호가 일치하지 않습니다. </span>
                            </span>
                            <input type="password" name="userPasswordCheck" onChange={handleChangePw}/>
                        </div>
                        <ButtonArea style={{margin : 0, width : '100%', flexDirection : 'row', justifyContent : 'flex-end', alignItems : 'center'}}>
                            <PasswordUpdate  onClick={handleUpdatePassword} style={{marginLeft : '2%'}}>완료</PasswordUpdate>
                            <PasswordUpdate style={{backgroundColor : 'red', marginLeft : '68%'}} onClick={() => {setModalOpen(false); setUserPassword(''); document.querySelector('input[name="userPasswordCheck"]').value = '';}}>취소</PasswordUpdate>
                        </ButtonArea>
                </PasswordUpdateModal>
            </> 
            }
            {getUser !== null && confirmVisible && <Confirm message={'정말 ' + getUser.userNickName + '님의 계정을 삭제하시겠습니까?'} onConfirm={handleConfirm} onCancel={handleCancel} />}
            {alertVisible && <Alert message={'계정이 삭제되었습니다.'} onClose={handleCancel2} />}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
    `;

const MainArea = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto;
    position: relative;
`;

const BackgRoundSection = styled.div`
    width: 96%;
    height: 35%;
    margin: 2%;
    border-radius: 20px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
    &:hover{
        border: 1px solid #01CD9A;
        cursor: pointer;
    }
`;
const UserIconSection = styled.div`
    width: 200px;
    height: 200px;
    position: absolute;
    top: 8%;
    left: 40%;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-sizing: border-box;
        &:hover{
            border: 1px solid #01CD9A;
            cursor: pointer;
        }
    }
`;
const UserInfoSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 86%;
    height: 65%;
    margin: 2%;
    margin-top: 0;
    position: relative;
    color: white;
`;

const UserInfoData = styled.div`
    width: 100%;
    height: 70%;
    background-color: #2C2E35;
    border-radius: 10px;
    position: absolute;
    top: 8%;

    p{
        margin-left: 10px;
        font-size: 18px;
        margin : 0;
        margin-top: 10px;
        margin-bottom: 5px;
        margin-left: 12px;
    }
    
    span{
        margin-left: 25px;
        display: inline-block;
        height: 40px;
    }
    
    input{
        margin-left: 25px;
        background-color: #1B1B1E;
        color: white;
        border: none;
        width: 93%;
        height: 40px;
        padding: 0px;
        padding-left: 15px;
        border-radius: 5px;
    }
`;

const UserName = styled.span`
    color: gray;
`;

const UpdateBtn = styled.span`
    position: absolute;
    right: 0%;
    width: 80px;
    border-radius: 5px;
    background-color: #01CD9A;
    text-align: center;
    box-sizing: border-box;
    &:hover{
        border: 1px solid blueviolet;
        cursor: pointer;
    }
`;

const ButtonArea = styled.div`
    background-color: #3C3C3D;
    display: flex;
    position: absolute;
    bottom: 0%;
    height: 15%;
    flex-direction: row;
`;

const PasswordUpdate = styled.span`
    position: absolute;
    bottom: 14%;
    left: 0%;
    color: white;
    width: 150px;
    border-radius: 5px;
    background-color: #01CD9A;
    text-align: center;
    height: 30px;
    box-sizing: border-box;
    margin-right: 15px;
    &:hover{
        border: 1px solid blueviolet;
        cursor: pointer;
    }
`;

const UserDataDelete = styled.div`
    position: absolute;
    bottom: 0%;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #2C2E35;
    border-radius: 10px;
    height: 12%;
    p{
        margin: 2px;
        margin-left: 30px;
        margin-top: 5px;
        color : #D9D9D9;
    }
    span{
        margin-left: 30px;
        margin-top: 5px;
        background-color: #E02626;
        width: 100px;
        border-radius: 5px;
        text-align: center;
        font-size: 13px;
        box-sizing: border-box;
        &:hover{
            border: 1px solid blueviolet;
            cursor: pointer;
        }
    }
`;

const UpdateDataSave = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #1B1B1E;
    border-radius: 10px;
    width: 100%;
    bottom: 3%;
    z-index: 9999;
    p{
        margin: 5px;
        margin-left: 40px;
    }
    div{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 10px;
        p{
            margin: 0;
            margin-right: 10px;
        }
        span{
            margin-left: 30px;
            margin-top: 5px;
            background-color: #01CD9A;
            width: 150px;
            border-radius: 5px;
            text-align: center;
            font-size: 13px;
            box-sizing: border-box;
            margin: 5px;
            &:hover{
                border: 1px solid blueviolet;
                cursor: pointer;
            }
        }
    }
`;

const PasswordUpdateModal = styled.div`
    position: absolute;
    background-color: #4B4C4F;
    width: 40%;
    height: 45%;
    top : 25%;
    left: 25%;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    color: white;
    overflow: hidden;
    h2{
        margin: 0;
        margin-top: 7%;
    }
    div{
        display: flex;
        flex-direction: column;
        width: 90%;
        margin: 2%;
        input{
            background-color: #232428;
            color: white;
            border: none;
            width: 95%;
            height: 40px;
            padding: 0px;
            padding-left: 15px;
            border-radius: 5px;
            margin-top: 15px;
        }
    }
`;

export default MyPage