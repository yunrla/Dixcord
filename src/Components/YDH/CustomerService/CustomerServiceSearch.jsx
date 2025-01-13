import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Search = styled.div`
    background-image: url('/images/ydh/ServiceMainSearch.png');
    background-position: center;
    background-size: cover;
    height: 320px;
    text-align: left;
    width: 100%;
    margin-top: -22px;
  
    .search-box {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        max-width: 610px;
        margin: 0 auto;
    }

    h1 {
        color: white;
        font-size: 2em;
        margin: 0.67em 0;
    }

    .search {
        position: relative;
        width: 100%;
    }

    .search input[type="search"] {
        border-radius: 4px;
        border: none;
        background-color: white;
        box-sizing: border-box;
        color: var(--text-normal);
        font-weight: 600;
        font-size: 1rem;
        height: 40px;
        padding-left: 50px; /* 아이콘 공간 확보 */
        padding-right: 20px;
        -webkit-appearance: none;
        width: 100%;
        color : black;
    }
`;

const StyledImage = styled.img`
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
`;

function CustomerServiceSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const nav = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            nav(`/service/search?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <Search>
            <div className="search-box">
                <h1>무엇을 도와드릴까요?</h1>
                <div className="search">
                    <StyledImage src="/images/ydh/searchIcon.png" />
                    <input 
                        type="search" 
                        placeholder="검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>
        </Search>
    );
}

export default CustomerServiceSearch;
