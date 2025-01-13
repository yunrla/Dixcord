import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from './Composition/Notice/Modal';

const Help = styled.div`
    text-align: center;

    .intro h1, .tweet-us h1 {
    margin-top: 50px;
    font-size: 2rem;
    line-height: 100%;
    margin-bottom: 0;
    font-weight: 700;
    }

    .intro p, .tweet-us p {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 35px;
    }

    .container {
    padding-left: 5px;
    padding-right: 5px;
    margin: 0;
    list-style: none;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-flow: row wrap;
    flex-flow: row wrap;
    justify-content: center;
    width: 100%;

    span {
    color: #01CD9A;
    text-decoration: none;
    box-sizing: border-box;
    }

    ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    unicode-bidi: isolate;
    }

    .container-li{
    background: white;
    padding: 5px;
    width: 240px;
    height: 240px;
    margin: 10px;
    color: #ccc;
    font-weight: bold;
    font-size: 3em;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #01CD9A;
    cursor: pointer;
    }

    .container-li h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #01CD9A;
    margin-top: 116px;
    }

    .container-li h3 {
    font-size: 0.9rem;
    font-weight: 500;
    width: 200px;
    margin: -10px auto 0;
    color: #6B6B6B;
    }

    .known-issues {
    background-image: url(/images/ydh/icon/01HZPN9TDVDV0GZBK41QZJ68J8.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }

    .text-chat {
    background-image: url(/images/ydh/icon/01HZPN9V5YPPQ1XX3PNE4SBEVZ.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }

    .faq {
    background-image: url(/images/ydh/icon/img_faq.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }

    .dm {
    background-image: url(/images/ydh/icon/img_direct_messaging.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }

    .server-setup {
    background-image: url(/images/ydh/icon/img_server_setuo.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }

    .trust-safety {
    background-image: url(/images/ydh/icon/01HZPN9V9NQBT2SQ3M1Z4BCTKC.svg);
    background-repeat: no-repeat;
    background-size: 106px;
    background-position: center 14px;
    width: 240px;
    height: 260px;
    }
}
`

function CustomerServiceHelp({getUser}) {
    const nav = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const moveNoticePage = () => {
        nav('/service/notice');
    };
    // const moveStartPage = () => {
    //     nav('/service/startpage')
    // }
    const MyQuestionPage = () => {
        if (getUser == null) {
            setIsModalOpen(true);
        } else {
            nav('/service/myquestion');
        }
    };
    const moveQnAPage = () => {
        nav('/service/qna')
    };
    const handleModalConfirm = () => {
        setIsModalOpen(false);
        nav('/login');
    };

    return (
        <Help>
            <Modal
                isOpen={isModalOpen}
                message="로그인이 필요합니다."
                onConfirm={handleModalConfirm}
                hideCloseButton={true}
            />
            <section className="intro">
                <h1 className='textCol'>도움이 필요하신가요? 저희가 도와드리겠습니다.</h1>
                <p className='textCol'>계정 설정부터 승인까지 DIXCODE와 관련된 모든것을 문의하세요.<br/>
                    DIXCODE를 시작한 지 얼마 안 되어 팁을 찾고 계신가요?</p> 
            </section>
            <section className="category">
                <ul className="container">
                    <span onClick={moveNoticePage}>
                        <li className="container-li known-issues">
                            <h2>공지사항</h2>
                            <hr />
                            <h3>Dixcode의 공지를 여기서 확인하세요</h3>
                        </li>
                    </span>
                    <span onClick={moveQnAPage}>
                        <li className="container-li faq">
                            <h2>자주 묻는 질문</h2>
                            <hr />
                            <h3>스스로 해결해 봐요</h3>
                        </li>
                    </span>
                    <span onClick={MyQuestionPage}>
                        <li className="container-li dm">
                            <h2>1 : 1 문의</h2>
                            <hr />
                            <h3>1대1 문의가 필요하신가요?</h3>
                        </li>
                    </span>
                </ul>
            </section>
        </Help>
    );
}

export default CustomerServiceHelp;