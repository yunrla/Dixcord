import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    top: 6%;
    right: 0.5%;
    border-radius: 20px;
    width: 400px;
    height: 400px;
    background-color: rgba(30, 31, 34, 0.7);
    z-index: 1000;
`;

const SliderButtonContainer = styled.div`
  position: relative;
  width: 60px;
  height: 34px;
  background-color: ${(props) => (props.isDarkMode ? '#4cd964' : '#e5e5ea')};
  border-radius: 34px;
  transition: background-color 0.3s ease;
  cursor: pointer;
`;

const Slider = styled.div`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.isDarkMode ? 'calc(100% - 32px)' : '2px')};
  width: 30px;
  height: 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transition: left 0.3s ease;
`;

const ToggleText = styled.span`
  position: absolute;
  top: 50%;
  left: ${(props) => (props.isDarkMode ? '10px' : '38px')};
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  opacity: ${(props) => (props.isDarkMode ? 1 : 0)};
  transition: opacity 0.3s ease, left 0.3s ease;
`;

function ModalAlarm(props) {
    return (
        <Container>
            <SliderButtonContainer
            >
            <Slider />
            <ToggleText>on</ToggleText>
            </SliderButtonContainer>
        </Container>
    );
}

export default ModalAlarm;