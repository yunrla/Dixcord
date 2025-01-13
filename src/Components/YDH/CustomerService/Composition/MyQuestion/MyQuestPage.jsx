import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPage = ({ data }) => {
    const navigate = useNavigate();

    const goToQuestions = () => {
        navigate(`/mypage/myquestions/${data.userCode}`);
    };

    return (
        <div>
            <h1>My Page</h1>
            <p>환영합니다, 사용자 코드: {data.userCode}</p>
            <button onClick={goToQuestions}>내 문의 보기</button>
        </div>
    );
};

export default MyPage;
