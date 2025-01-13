import axios from 'axios';
import React, { useEffect, useState } from 'react'; // React와 useState, useEffect 훅을 가져옵니다.
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // CSS-in-JS 스타일링 라이브러리인 styled-components를 가져옵니다.

// 모달 배경 스타일 정의
const ModalBackground = styled.div`
  position: fixed; // 화면의 고정 위치에 렌더링되도록 설정
  top: 0;
  left: 0;
  width: 100%; // 화면 전체 너비
  height: 100%; // 화면 전체 높이
  display: flex; // 가운데 정렬을 위해 플렉스 박스 사용
  justify-content: center;
  align-items: center;
  z-index: 1000; // 다른 요소보다 위에 배치
`;

// 모달 내용 스타일 정의
const ModalContent = styled.div`
  background:rgba(44, 46, 53, 0.9); // 배경색
  color: #DFDFDF;
  padding: 20px; // 내부 여백
  border-radius: 8px; // 모서리를 둥글게 처리
  width: 90%; // 화면 너비의 90% 사용
  max-width: 400px; // 최대 너비 제한
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // 그림자 효과
  position: relative; // 닫기 버튼의 절대 위치를 위한 기준 설정

  .explanation{
    font-size: 12px;
    color: #01CD9A;
  }
`;

// 모달 닫기 버튼 스타일 정의
const CloseButton = styled.button`
  position: absolute; // 모달의 오른쪽 위에 고정
  top: 10px;
  right: 10px;
  background: #01CD9A; // 배경색 
  color: #FFFFFF; // 글자색   
  border: none; // 테두리 제거
  padding: 5px 10px; // 버튼 내부 여백
  border-radius: 4px; // 모서리 둥글게
  cursor: pointer; // 마우스 포인터 변경
`;

// 검색 입력창 스타일 정의
const SearchInput = styled.input`
  background: #1B1B1E;
  color: #DFDFDF;
  width: 93.7%; // 가로로 꽉 채움
  padding: 10px; // 입력창 내부 여백
  margin-top: 20px; // 상단 여백
  border-radius: 9px; // 모서리 둥글게
`;

// 이전 검색어 리스트
const SuggestionsList = styled.ul`
  margin-top: 10px;
  padding: 0;
  list-style: none;
  max-height: 200px; // 최대 높이를 설정 (5개 항목 기준)
  overflow-y: auto; // 내용이 초과될 경우 스크롤 활성화

  li {
    background: #2C2E35;
    display: flex; // 아이콘과 텍스트를 가로로 정렬
    align-items: center; // 세로로 정렬
    padding: 10px;
    cursor: pointer;
    margin-bottom: 3px; // 상단 여백
    border-radius: 9px; // 모서리 둥글게
    &:hover {
      background: rgb(95, 95, 95);
    }

    img {
      border-radius: 50%;
    }
  }

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2C2E35;
    border-radius: 10px;
    border: 2px solid #414249;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #414249;
  }
`;

const SuggestionsList2 = styled.ul`
  margin-top: 10px;
  padding: 0;
  list-style: none;
  font-size: 14px;
  max-height: 130px; // 최대 높이를 설정 (3개 항목 기준)
  overflow-y: auto; // 내용이 초과될 경우 스크롤 활성화

  li {
    display: flex; // 플렉스 박스를 사용하여 텍스트와 버튼 정렬
    background: #2C2E35;
    display: flex; // 아이콘과 텍스트를 가로로 정렬
    align-items: center; // 세로로 정렬
    padding: 10px;
    cursor: pointer;
    margin-bottom: 3px; // 상단 여백
    border-radius: 9px; // 모서리 둥글게
    &:hover {
      background: rgb(95, 95, 95);
    }

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      }
      .delete-button {
        background: #01CD9A; // 버튼 배경색
        color: #000; // 텍스트 색상
        border: none;
        padding: 5px 10px; // 버튼 내부 여백
        border-radius: 4px; // 모서리 둥글게
        cursor: pointer;
        font-size: 12px;
        margin-left: auto;
        &:hover {
          background:rgb(1, 170, 128); // 호버 효과
          }
        }
    }


  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2C2E35;
    border-radius: 10px;
    border: 2px solid #414249;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #414249;
  }
`;

// 검색 결과가 없을 때 표시되는 메시지 스타일 정의
const NoResults = styled.div`
  margin-top: 10px;
  padding: 10px;
  color: #DFDFDF; // 어두운 회색 텍스트
  text-align: center; // 텍스트 가운데 정렬
  font-size: 14px;
  background: #2C2E35; // 연한 회색 배경
  border-radius: 9px; 
`;

const RoomInviteCode = styled.span`
  color: #888;
  font-size: 12px;
`;

// 모달 컴포넌트 정의
const Sidebarsearch = ({ searchStatus, setSearchStatus, roomNumber }) => {
  const [filteredTitles, setFilteredTitles] = useState([]); // 검색 결과를 저장하는 상태
  const [searchQuery, setSearchQuery] = useState(""); // 입력된 검색어 상태 
  const [searchHistory, setSearchHistory] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    // 검색어가 비어있을 경우 검색 결과 초기화
    if (searchQuery.trim() === "") {
      setFilteredTitles([]);
      return;
    }

    // // Spring API 호출하여 검색어에 해당하는 데이터 가져오기
    axios
    .get(`/api/rooms/search?query=${encodeURIComponent(searchQuery)}`)
    .then((response) => {
      console.log("API Response:", response.data);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setFilteredTitles(response.data);
    })  
    .catch((err) => console.error("Error fetching room titles:", err));

    // fetch(`/api/rooms/search.json?query=${encodeURIComponent(searchQuery)}`)
    // .then((response) => {

    //   console.log(response.ok);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
    //   console.log(response.json());
    //   return response.json(); // JSON 형식으로 응답 파싱
    // })
    // .then((data) => {
    //   setFilteredTitles(data);
    // }) // 상태 업데이트
    // .catch((error) => console.error("Error fetching room titles:", error));
  }, [searchQuery]); // 검색어가 변경될 때마다 실행

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // 입력된 값을 상태에 저장
  };

  const saveToLocalStorage = (room) => {
    const existingHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const filteredHistory = existingHistory.filter((item) => item.roomNumber !== room.roomNumber);
    const updatedHistory = [room, ...filteredHistory];
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleSuggestionClick = (roomNumber, roomTitle) => {
    console.log("Clicked Room:", { roomNumber, roomTitle }); // 디버깅용 로그
    const room = { roomNumber, roomTitle };
    saveToLocalStorage(room);
    setSearchHistory((prev) => [room, ...prev.filter((item) => item.roomNumber !== roomNumber)]);
    setSearchQuery('');
    setFilteredTitles([]);
    setSearchStatus(false);
    nav('/room/' + roomNumber);
  };

  const handleDeleteHistoryItem = (roomNumber) => {
    const updatedHistory = searchHistory.filter(
      (item) => item.roomNumber !== roomNumber
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const onClose = () => {
    setSearchStatus(false);
  }
 
  return (
    // 모달 배경 클릭 시 모달 닫기
    <ModalBackground onClick={(e) => e.target === e.currentTarget && onClose()} style={searchStatus? {display:'flex'} : {display:'none'}}>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <SearchInput type="text" value={searchQuery} onChange={handleInputChange} placeholder="어디로 가고 싶은가요?"/>
        {searchQuery && (
          <>
            {filteredTitles.length > 0 ? (
              // 검색 결과가 있을 경우 표시
              <SuggestionsList>
                {filteredTitles.map(room => (
                  <li key={room.roomNumber} onClick={() => handleSuggestionClick(room.roomNumber, room.roomTitle)}>
                    <img src={`/${room.roomIcon !== null ? room.roomIcon : 'logo192.png'}`} alt="" style={{
                      width: "30px", 
                      height: "30px",
                      marginRight: "10px",
                      verticalAlign: "middle"}}/>
                    {room.roomTitle}<RoomInviteCode>{"#" + room.roomInviteCode}</RoomInviteCode>
                  </li>
                ))}
              </SuggestionsList>
            ) : (
              // 검색 결과가 없을 경우 메시지 표시
              <NoResults>해당 채널이 없습니다</NoResults>
            )}
          </>
        )}
        {searchHistory.length > 0 && (
          <div>
            <h4>이전 채널</h4>
            <SuggestionsList2>
              {searchHistory.map((room) => (
                <li key={room.roomNumber} onClick={() => handleSuggestionClick(room.roomNumber, room.roomTitle)}>
                  <span>{room.roomTitle}</span>
                  <button className="delete-button" onClick={(e) => {
                      e.stopPropagation(); // 부모 요소로 이벤트 전달 방지
                      handleDeleteHistoryItem(room.roomNumber);}}
                  >X</button>
                </li>
              ))}
            </SuggestionsList2>
          </div>
        )}
        <span className='explanation'>코드로 찾길 원한다면 검색창에 #을 넣으세요</span>
      </ModalContent>
    </ModalBackground>
  );
};

export default Sidebarsearch;
