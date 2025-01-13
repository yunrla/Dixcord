import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const SerachHeader = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 40px;
  margin-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  span {
    font-size: 1.2rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;

  .render {
    margin-left: 10px; /* 아이콘과 텍스트 간격 조정 */
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .headerSearch {
    border-radius: 4px;
    height: 35px;
    font-size: 1rem;
    padding-left: 40px; /* 아이콘 공간 확보 */
    width: 150px; /* 적절한 너비 설정 */
    color : black;
  }

  .searchIcon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    pointer-events: none; /* 아이콘 클릭 방지 */
  }
`;

const StyledImage = styled.img`
  width: 40px;
  height: 40px;
`;

function ServiceSearch() {
  const location = useLocation();
  const { idx } = useParams();
  const { userCode } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const nav = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      nav(`/service/search?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  const renderHeader = () => {
    if (location.pathname === '/service/notice') {
      return '고객센터 > 공지사항';
    } else if (location.pathname === '/service/notice/write') {
      return '고객센터 > 공지사항 > 공지글 > 관리자 공지글 작성';
    } else if (location.pathname.startsWith('/service/notice/modify/') && idx) {
      return '고객센터 > 공지사항 > 공지글 > 관리자 수정';
    } else if (location.pathname.startsWith('/service/notice/') && idx) {
      return `고객센터 > 공지사항 > 공지글`;
    }
    if (location.pathname === '/service/qna') {
      return '고객센터 > Q & A';
    }
    if (location.pathname === '/service/search') {
      return '고객센터 > 검색 결과';
    }
    if (location.pathname === '/service/myquestion') {
      return '고객센터 > 내 문의';
    }
    if (location.pathname.startsWith('/mypage/myquestions/') && userCode) {
      return '고객센터 > 내 문의';
    }
  };

  return (
    <SerachHeader>
      <HeaderLeft>
        <StyledImage src="/images/ydh/homeIcon.png" />
        <span className="render textCol">{renderHeader()}</span>
      </HeaderLeft>
      <HeaderRight>
        <img src="/images/ydh/searchIcon.png" alt="검색 아이콘" className="searchIcon" />
        <input
          className="headerSearch"
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </HeaderRight>
    </SerachHeader>
  );
}

export default ServiceSearch;
