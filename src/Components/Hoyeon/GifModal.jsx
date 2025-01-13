import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #2f3136;
  color: #fff;
  border-radius: 5px;
  width: 450px;  // 원하는 모달 크기
  max-height: 80vh;  // 화면 높이를 넘지 않도록 설정
  margin-bottom: 480px;
  margin-left: 430px;
  overflow-y: auto;
  border: 0.5px solid #444649;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #b9bbbe;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: #7289da;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 450px;
`;

const SearchBar = styled.input`
  width: 90%;
  padding: 8px 30px 8px 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 17px;
  background-color: #202225;
  color: #fff;

  &::placeholder {
    color: #b9bbbe;
  }

  &:focus {
    border: 2px solid #7289da;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  right: 10px;
  top: 32%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #b9bbbe;
  cursor: pointer;

  &:hover {
    fill: #7289da;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  max-width: 600px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100px;
  border-radius: 10px;
  background-color: #36393f;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7289da;

    span {
      font-weight: bold;
      color: #fff;
    }

    img {
      filter: brightness(1);
    }
  }
`;

const CategoryImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
  transition: filter 0.3s ease;
`;

const CategoryName = styled.span`
  position: relative;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  z-index: 1;
`;

const categories = [
  { name: "인기 GIF", query: "trending" },
  { name: "귀여운 GIF", query: "cute" },
  { name: "웃긴 GIF", query: "funny" },
  { name: "무서운 GIF", query: "scary" },
  { name: "슬픈 GIF", query: "sad" },
  { name: "사랑스러운 GIF", query: "love" },
];

const GifModal = ({ isOpen, onClose, setGifSrc }) => {
  const [search, setSearch] = useState(""); 
  const [gifs, setGifs] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [showCategories, setShowCategories] = useState(true); // 카테고리 선택 여부 상태
  const [categoryImages, setCategoryImages] = useState({}); // 카테고리별 이미지 저장
  
  // const apiKey = "kzLCVLMatpszvQKXmLw7eAvYBiQc5hI5"; // Giphy API 키
  const apiKey = "cr6l7mWOPL23ECTCxViHQOXGkYJCysPI"; // Giphy API 키

  // 카테고리별 GIF 가져오기
  const fetchCategoryGif = async (categoryQuery) => {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${categoryQuery}&limit=1`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.data.length > 0) {
        return data.data[0].images.fixed_height.url;
      }
    } catch (error) {
      console.error("GIF 가져오기 실패:", error);
    }
    return null;
  };

  const fetchGifs = async () => {
    setLoading(true);
    const query = selectedCategory || search;
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.error("GIF 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryQuery) => {
    setSelectedCategory(categoryQuery);
    fetchGifs(categoryQuery);
    setShowCategories(false); // 카테고리 클릭 후 검색창 숨기기
  };

  const handleBackClick = () => {
    setShowCategories(true); // 카테고리 화면으로 돌아가면 검색창 보이기
    setSelectedCategory("");
    setSearch("");
  };

  const handleGifClick = (gifUrl) => {
    setGifSrc(gifUrl); 
    onClose(); 
  };

  useEffect(() => {
    if (isOpen && (search || selectedCategory)) {
      fetchGifs();
    }
  }, [search, selectedCategory, isOpen]);

  useEffect(() => {
    // 카테고리별 GIF 이미지를 가져옵니다
    const fetchImages = async () => {
      const images = {};
      for (let category of categories) {
        const gifUrl = await fetchCategoryGif(category.query);
        if (gifUrl) {
          images[category.query] = gifUrl;
        }
      }
      setCategoryImages(images);
    };
    fetchImages();
  }, []);

  

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchIconClick = () => {
    const matchedCategory = categories.find((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) // 검색어가 카테고리 이름에 포함되어 있는지 확인
    );
  
    if (matchedCategory) {
      setSelectedCategory(matchedCategory.query);  // 카테고리로 바로 이동
      fetchGifs(matchedCategory.query);  // 해당 카테고리의 GIF 로드
      setShowCategories(false); // 카테고리 클릭 후 검색창 숨기기
    } else {
      console.log('No matching category found');
      fetchGifs();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackground onClick={onClose}>
    <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* <CloseButton onClick={onClose}>×</CloseButton> */}
        
        {/* 검색바 조건부 렌더링 */}
        {showCategories && (
          <SearchWrapper>
            <SearchBar
              placeholder="카테고리 검색하기"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchIcon
              aria-label="검색하기"
              onClick={handleSearchIconClick}
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                clipRule="evenodd"
              />
            </SearchIcon>
          </SearchWrapper>
        )}

        {showCategories ? (
          <CategoryGrid>
            {filteredCategories.slice(0, 6).map((category, index) => (
              <CategoryItem
                key={index}
                onClick={() => handleCategoryClick(category.query)}
              >
                {/* 카테고리별 GIF 이미지 사용 */}
                <CategoryImage
                  src={categoryImages[category.query] || 'https://via.placeholder.com/200'}
                  alt={category.name}
                />
                <CategoryName>{category.name}</CategoryName>
              </CategoryItem>
            ))}
          </CategoryGrid>
        ) : (
          <div>
              <div 
                onClick={handleBackClick} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-start', 
                  fontFamily: 'Arial, sans-serif',  
                  cursor: 'pointer', 
                  fontSize: '20px', // 글씨 크기 기본 설정
                  color: '#b9bbbe',  // 기본 글씨 색
                  padding: '5px 10px'  
                }}
              >
              <i 
                className="bi bi-arrow-left" 
                style={{
                  marginRight: '8px',
                  fontSize: '20px'  
                }}
              ></i>
              {selectedCategory}
            </div>
            <div style={{ width: '100%', maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
              {loading && <p>Loading...</p>}
              {gifs.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {gifs.map((gif) => (
                    <div key={gif.id} style={{ width: "200px", margin: "10px" }}>
                      <img
                        src={gif.images.fixed_height.url}
                        alt={gif.title}
                        style={{ width: "100%", borderRadius: "10px" }}
                        onClick={() => handleGifClick(gif.images.fixed_height.url)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No GIFs found</p>
              )}
            </div>
          </div>
        )}
      </ModalContainer>
    </ModalBackground>
  );
};

export default GifModal;
