import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function AdminMain(props) {

    const [allUser, setAllUser] = useState([]);

    const [allInq, setAllInq] = useState([]);

    const [allNot, setAllNot] = useState([]);

    const nav = useNavigate();

    const getAllUser = () => {
        axios.get('/user/api/getUserListAll')
            .then(response => setAllUser(response.data));
    }

    const getAllInq = () => {
        axios.get('/admin/api/getAllInquiry')
            .then(response => {
                setAllInq(response.data);
            });
    }

    const getAllNot = () => {
        axios.get('/noticeList')
            .then(response => {
                setAllNot(response.data);
            });
    }

    useEffect( () => {
        getAllUser();
        getAllInq();
        getAllNot();
    }, []);

    const handleGoinq = () => {
        nav('/adminService');
    }

    const handleGoNot = () => {
        nav('/service/notice');
    }

    const handleGoUser = () => {
        nav('/adminUser');
    }

    return (
        <Container>
            <MainArea className='backgCon'>
                <Section className='backgCon'>
                    <SectionTitle>총 유저 수</SectionTitle>
                    <SectionContent>{allUser.length}명</SectionContent>
                </Section>
                <Section className='backgCon'>
                    <SectionTitle>최근 문의 내역</SectionTitle>
                    <SectionContent>
                        {allInq.length > 0 && 
                        <ul>
                            <li>{allInq[0].category}: {allInq[0].content}</li>
                            <li>{allInq[1].category}: {allInq[1].content}</li>
                            <li>{allInq[2].category}: {allInq[2].content}</li>
                        </ul>
                        }
                    </SectionContent>
                </Section>
                <Section className='backgCon'>
                    <SectionTitle>최근 공지사항</SectionTitle>
                    <SectionContent>
                        {allNot.length > 0 && 
                        <ul>
                            <li>{allNot[0].title} [  {new Date(allNot[0].regDate).toLocaleDateString('en-CA')}  ]</li>
                            <li>{allNot[1].title} [  {new Date(allNot[1].regDate).toLocaleDateString('en-CA')}  ]</li>
                            <li>{allNot[2].title} [  {new Date(allNot[2].regDate).toLocaleDateString('en-CA')}  ]</li>
                        </ul>
                        }
                    </SectionContent>
                </Section>
                <Footer>
                    <FooterButton className='backgCon' onClick={handleGoUser}>유저 관리</FooterButton>
                    <FooterButton className='backgCon' onClick={handleGoinq}>문의 관리</FooterButton>
                    <FooterButton className='backgCon' onClick={handleGoNot}>공지 관리</FooterButton>
                </Footer>
            </MainArea>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    `;

const MainArea = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    border-radius: 20px;
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 96.5%;
    margin: 10px;
    margin-left: 0;
    
`;

const Section = styled.div`
    background-color: #36393f;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 10px;
`;

const SectionContent = styled.div`
    font-size: 16px;
    line-height: 1.5;
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-top: 1px solid #42454a;
    margin-top : 150px;
`;

const FooterButton = styled.a`
    color: #ffffff;
    text-decoration: none;
    font-size: 18px;
    flex: 1;
    text-align: center;
    padding: 10px;
    margin: 0 5px;
    border-radius: 8px;
    background-color: #393c43;
    transition: background-color 0.3s;

    &:hover {
        background-color: #5865f2;
        color: #ffffff;
        cursor : pointer;
    }
`;

export default AdminMain;