import React from 'react';
import styled from 'styled-components';

function AdminNotice(props) {
    return (
        <Container>
            <MainArea>
                
            </MainArea>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    `;

const MainArea = styled.div`
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto;
`;

export default AdminNotice;