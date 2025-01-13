import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Area = styled.div`
    color: white;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-left: 250px;
    margin-right: 250px;
    width: 900px;
    overflow-y: auto;
`;

const Section = styled.div`
    flex: 1;
    h3 {
        margin-bottom: 8px;
    }
    ul {
        margin-top: 0;
        padding-left: 20px;
    }
    li {
        list-style-type: none;
    }
`;

const StyledLink = styled(Link)`
    color: #01cd9a;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const pathNameMapping = {
    "/service/notice": "공지사항(안나와야함)",
    "/service/qna": "자주 묻는 질문(안나와야함)",
};

const RecentAndRelated = () => {
    const [recentPages, setRecentPages] = useState([]);
    const [titles, setTitles] = useState({});
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const pages = JSON.parse(localStorage.getItem("recentPages")) || [];

        if (!pages.includes(path) && !["/service/notice", "/service/qna"].includes(path)) {
            pages.unshift(path);
        }

        const updatedPages = pages
            .filter(
                (page) => !["/service/notice", "/service/qna"].includes(page)
            ) // 특정 경로 제외
            .slice(0, 4);

        setRecentPages(updatedPages);
        localStorage.setItem("recentPages", JSON.stringify(updatedPages));
    }, [location]);

    useEffect(() => {
        recentPages.forEach((path) => {
            const idx = path.split("/").pop();
            if (!isNaN(idx)) {
                axios.get(`/getNoticeTitle?idx=${idx}`).then((response) => {
                    setTitles((prev) => ({ ...prev, [path]: response.data }));
                });
            }
        });
    }, [recentPages]);

    // 최근 문서 분리
    const recentFirstTwo = recentPages.slice(0, 2);
    const recentLastTwo = recentPages.slice(2);

    return (
        <Area>
            <Section>
                <h3>최근 본 공지사항</h3>
                <ul>
                    {recentFirstTwo.length > 0 ? (
                        recentFirstTwo.map((path, index) => (
                            <li key={index}>
                                <StyledLink to={path}>
                                    {titles[path]}
                                </StyledLink>
                            </li>
                        ))
                    ) : (
                        <li>최근 본 공지가 없습니다.</li>
                    )}
                </ul>
            </Section>
            <Section>
                <h3>ㅤ</h3>
                <ul>
                    {recentLastTwo.length > 0 ? (
                        recentLastTwo.map((path, index) => (
                            <li key={index}>
                                <StyledLink to={path}>
                                    {titles[path]}
                                </StyledLink>
                            </li>
                        ))
                    ) : (
                        <li></li>
                    )}
                </ul>
            </Section>
        </Area>
    );
};

export default RecentAndRelated;
