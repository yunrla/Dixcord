import React from 'react';
import styled from 'styled-components';
import BodyDiv from './BodyDiv'; 

const RightAreaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

function RightArea({ friendList, openModal, user }) {
    return (
        <RightAreaWrapper>
            <BodyDiv friendList={friendList} openModal={openModal} user={user}/>
        </RightAreaWrapper>
    );
}

export default RightArea;
