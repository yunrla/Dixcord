import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.div`
    width: 100%;
`;
const InputDiv = styled.div`
    position: relative;
    margin-top: -25px;

    h2 {
        margin-left: 15px;
    }
    
    span {
        margin-left: 15px;
        color: #d6d6d6;
    }

    .input-container {
        display: flex; /* 플렉스 박스를 사용하여 정렬 */
        align-items: center;
        width: 97%;
        /* margin: 20px auto 0; */
        margin-top: 20px;
        margin-left: 10px;
        background-color: #1E1F22;
        border: ${({ success, error }) => 
            success ? '2px solid #34C759' : 
            error ? '2px solid #EC221F' : 
            '2px solid #1E1F22'};
        border-radius: 10px;
        padding: 5px;
    }

    input {
        flex: 1; /* 입력창이 가능한 공간을 차지하도록 설정 */
        height: 40px;
        border: none;
        background-color: transparent;
        color: #DBDEE1;
        padding: 8px;
        font-size: 15px;
    }

    input:focus {
        outline: none;
    }

    ::placeholder {
        color: #878787; 
        font-size: 16px;
    }

    button {
        height: 35px;
        background-color: #01CD9A; 
        border: none;
        color: #DBDEE1;
        cursor: pointer;
        padding: 5px 12px;
        font-size: 16px;
        border-radius: 4px;
        font-weight: bold;
        margin-left: 10px;
        margin-right: 10px;
    }

    .success-message {
        color: #34C759;
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
    }

    .error-message {
        color: #EC221F;
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
    }
`;

function AddFriends({ userData }) {
    const [inputSearchFriend, setInputSearchFriend] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangeInput = (e) => {
        setInputSearchFriend(e.target.value);
        setErrorMessage(''); // 입력 중 에러 메시지 초기화
        setSuccessMessage(''); // 입력 중 성공 메시지 초기화
    };

    const handleSendFriend = async () => {
        const email = inputSearchFriend.trim();
        
        const checkEmail = await axios.get('/test/api/emailCheck?email=' + email);
        const friendData = checkEmail.data;

        if (!friendData) {
            setErrorMessage('사용자명을 올바르게 입력했는지 확인하세요.');
            return;
        }

        const addFriend = await axios.post('/api/addAllFriends', {
            userCode: userData.userCode,
            friendCode : friendData.userCode,
            userNickName : friendData.userNickName
        });

        if (addFriend.data === '친구 추가 완료') {
            setSuccessMessage(`'${friendData.userNickName}'에게 성공적으로 친구 요청을 보냈어요`);
            setInputSearchFriend(''); // 입력창 초기화
        } else {
            setErrorMessage('사용자명을 올바르게 입력했는지 확인하세요.');
        }
    };

    return (
        <Header>
            <InputDiv success={!!successMessage} error={!!errorMessage}>
                <h2>친구 추가하기</h2>
                <span>Dixcord 사용자명을 사용하여 친구를 추가할 수 있어요.</span>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputSearchFriend}
                        onChange={handleChangeInput}
                        placeholder="이메일로 검색해보세요."
                    />
                    <button onClick={handleSendFriend}>친구 요청 보내기</button>
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </InputDiv>
        </Header>
    );
}

export default AddFriends;
