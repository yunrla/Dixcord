import React, { useState } from "react";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

// 스타일 정의
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border: 0.5px solid #3c3e41;
`;

const EmojiPickerWrapper = styled.div`
  display: flex;
  width: 500px; /* 크기 조정 */
  margin-left: 500px;
  margin-bottom: 350px;
  background-color: #2f3136;
  border-radius: 8px;
  overflow: hidden;
  color: #fff;
`;

const Sidebar = styled.div`
  width: 80px;  /* 사이드바 너비를 80px로 키움 */
  background-color: #202225;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  gap: 1.3rem;
  border: 0.5px solid #444649;

  i {
    font-size: 1.5rem; /* 사이드바 아이콘 크기 키움 */
    color: #b9bbbe;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }

  .active {
    color: #fff;
  }
`;

const EmojiSection = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border: 0.5px solid #444649;
`;

const EmojiCategory = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 14px;
    font-weight: bold;
    margin-left: 9px;
    color: #bbb;
  }
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);  /* 한 줄에 6개씩 배치 */
  gap: 0.8rem;  /* 아이콘 간의 간격을 조금 추가 */
  max-height: 250px; /* 크기 조정 */

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
`;

const EmojiButton = styled.button`
  font-size: 2.5em; /* 아이콘 크기 조정 */
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s;
  margin: -8px;
  

  &:hover {
    transform: scale(1.1);
  }
`;

const categoryNames = {
  frequentlyUsed: <i style={{fontSize:"16px"}} className="bi bi-emoji-smile"><span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 기호</span></i>,
  people: <i style={{fontSize:"16px"}} className="bi bi-person"> <span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 사람</span></i>,
  nature: <i style={{fontSize:"16px"}} className="bi bi-tree"> <span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 자연</span></i>,
  food: <i style={{fontSize:"16px"}} className="bi bi-emoji-smile"> <span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 활동</span></i>,
  activities: <i style={{fontSize:"16px"}} className="bi bi-egg-fried"> <span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 음식</span></i>,
  objects: <i style={{fontSize:"16px"}} className="bi bi-box"> <span style={{fontFamily:"sans-serif", fontSize:"16px"}}> 사물</span></i>,
};

// 이모티콘 데이터
const emojiCategories = {
  frequentlyUsed: ["❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💔","❣","💕"
                  ,"➕","➖","✖","➗","💌","💢","💥","💤","💦","💨","💫","🕳","❓","❔"],
  people: [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗",
    "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥",
  ],
  nature: ["🌳", "🌵", "🌸", "🌞", "🌙", "⭐", "🔥", "🌈", "☁️", "🌊"],
  food: ["🍎", "🍔", "🍕", "🍣", "🍩", "🍰", "☕", "🍹", "🍫"],
  activities: ["⚽", "🏀", "🏈", "🎾", "🎱", "🏆", "🎯", "🎨"],
  objects: ["💡", "📱", "💻", "⌚", "🔒", "🔑", "💎", "🔨"],
};

const EmojiPicker = ({ setSelectedEmoji }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("frequentlyUsed");

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    setIsOpen(false); // 선택 후 모달 닫기
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      setIsOpen(false);
    }
  };

  return (
    <>
      <span onClick={() => {setIsOpen(true)
            const intputElement = document.getElementById('chatInput');
            // console.log(intputElement);
            if(intputElement){
              intputElement.focus();
            }  
      }}> <i className="bi bi-emoji-smile"></i></span>
      {/* {selectedEmoji && <p>{selectedEmoji}</p>} */}

      {isOpen && (
        <ModalBackground id="modal-background" onClick={handleOutsideClick}>
          <EmojiPickerWrapper>
            {/* 왼쪽 카테고리 바 */}
            <Sidebar>
              {Object.keys(emojiCategories).map((category) => (
                <i
                  key={category}
                  className={`bi bi-${
                    category === "frequentlyUsed"
                      ? "emoji-smile"
                      : category === "people"
                      ? "person"
                      : category === "nature"
                      ? "tree"
                      : category === "food"
                      ? "egg-fried"
                      : category === "activities"
                      ? "trophy"
                      : "box"
                  }`}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    color: activeCategory === category ? "#fff" : "#b9bbbe",
                  }}
                ></i>
              ))}
            </Sidebar>

            {/* 이모티콘 섹션 */}
            <EmojiSection>
              <EmojiCategory>
                <h3>{categoryNames[activeCategory]}</h3>
              </EmojiCategory>
              <EmojiGrid>
                {emojiCategories[activeCategory].map((emoji, index) => (
                  <EmojiButton key={index} onClick={() => handleEmojiClick(emoji)}>
                    {emoji}
                  </EmojiButton>
                ))}
              </EmojiGrid>
            </EmojiSection>
          </EmojiPickerWrapper>
        </ModalBackground>
      )}
    </>
  );
};

export default EmojiPicker;
