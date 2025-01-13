import React, { useEffect } from 'react';
import styled from 'styled-components';
import CustomerServiceSearch from './CustomerServiceSearch';
import CustomerServiceHelp from './CustomerServiceHelp';

const Area = styled.div`
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto; // 내용이 초과될 경우 스크롤 활성화
`;

function CustomerService({setSideBarStatus, getUser}) {
    useEffect( () => {
        setSideBarStatus('non');
    }, [])
    return (
        <Area style={getUser === null ? {width : '70%', marginLeft : '15%'} : {width : '100%'}} className='backgCon'>
            <CustomerServiceSearch/>
            <CustomerServiceHelp getUser={getUser}/>
        </Area>
    );
}

export default CustomerService;