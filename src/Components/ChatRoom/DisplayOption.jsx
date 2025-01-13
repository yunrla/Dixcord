import React, { useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from "react-color";

const Wrapper = styled.div`
background-color: rgba(30, 31, 34, 0.7);
width: 100%;
margin: 10px;
margin-left: 0;
margin-right: 15px;
border-radius: 20px;
overflow-y: auto;
display: flex;                
color: aliceblue;
justify-content:center;
padding: 20px; /* 여백을 추가해보기 */
`

const Container = styled.div`
width: 60%;
margin-top: 50px;
`

const ColorDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(6,1fr);
  gap: 15px;
  padding: 50px 10px;
  border: 1px solid #01CD9A;
  border-radius: 10px;
  height: auto;
;
`


const CloseButton = styled.span`
  color: aliceblue;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 30px;
  transition: color 0.3s ease;
  &:hover {
    color: #f50dbb;
  }
;`

const ColorItem = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
;`

const Circle2 = styled.div`
    background-image: url('//192.168.0.140/uploadImg/icon/plus.png');
    cursor: pointer;
    background-size: cover;
    background-position: center;
    margin-top: 10px;
    width: 50px;
    height: 50px;
    position: relative;
    border: solid 1px  #01CD9A;
    border-radius: 50%;
`


function DisplayOption() {

  const [color, setColor] = useState("#ffffff");
  const [colorModal, setColorModal] = useState(false);
  const [customColor, setCustomColor] = useState(''); // 사용자 색상 저장
  const [colorOptions, setColorOptions] = useState([
    { src: '//192.168.0.140/uploadImg/icon/palette/white.png', alt: 'white' },
    { src: '//192.168.0.140/uploadImg/icon/palette/black.png', alt: 'black' },
    { src: '//192.168.0.140/uploadImg/icon/palette/darkRed.png', alt: 'darkRed' },
    { src: '//192.168.0.140/uploadImg/icon/palette/lime.png', alt: 'lime' },
    { src: '//192.168.0.140/uploadImg/icon/palette/peach.png', alt: 'peach' },
    { src: '//192.168.0.140/uploadImg/icon/palette/ocean.png', alt: 'ocean' },
    { src: '//192.168.0.140/uploadImg/icon/palette/blue.png', alt: 'blue' },
    { src: '//192.168.0.140/uploadImg/icon/palette/red.png', alt: 'red' },
    { src: '//192.168.0.140/uploadImg/icon/palette/yellow.png', alt: 'yellow' },
    { src: '//192.168.0.140/uploadImg/icon/palette/lightgrey.png', alt: 'sky' },
    { src: '//192.168.0.140/uploadImg/icon/palette/pink.png', alt: 'pink' },
  ]);

  const handleColor = () => {
    setColorModal(prev => !prev);
    
  };

  const handleChangeColor = (selectedColor) => {
    setColor(selectedColor.hex);
    setCustomColor(selectedColor.hex); // 사용자 색상 업데이트

  };

  const handlePaletteClick = (selectedColor) => {
    setColor(selectedColor);
    setCustomColor(''); // 사용자 색상 초기화
  };

  const handleAddCustomColor = () => {
    // 새로운 배열을 생성하여 colorOptions 상태 업데이트
    setColorOptions(prevOptions => [
      ...prevOptions,
      { src: '//192.168.0.140/uploadImg/icon/palette/changePalette.png', alt: customColor, style: { backgroundColor: customColor } }
    ]);
    
  };

  return (
    <>
      <Wrapper>
        <Container>
          <CloseButton>&times;</CloseButton>

          <header>
            <h2>디스플레이</h2>
          </header>

          <p>테마</p>

          <ColorDiv>
            {colorOptions.map((option, index) => (
              <ColorItem
                key={index}
                src={option.src || ''}
                alt={option.alt}
                style={option.style || {}}
                onClick={() => handlePaletteClick(option.style ? option.style.backgroundColor : option.src)}
              />
            ))}
            <Circle2 onClick={handleColor} />
          </ColorDiv>

          {colorModal && (
            <div style={{ position: 'fixed', bottom: 50, right: 0, gap: 20 }}>
              <SketchPicker
                color={color}
                onChangeComplete={handleChangeColor}
                width="250px"
              />
              <button onClick={handleAddCustomColor}>커스텀 색상 추가</button>
            </div>
          )}
        </Container>
      </Wrapper>
    </>
  );
}

export default DisplayOption;
