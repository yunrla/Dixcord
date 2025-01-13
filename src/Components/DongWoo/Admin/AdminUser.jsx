import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Alert from '../../Alert/Alert';
import Confirm from '../../Alert/Confirm';

function AdminUser(props) {

    const [allUser, setAllUser] = useState([]);

    const [targetUser, setTargetUser] = useState(null);

    const [modalStyle, setModalStyle] = useState({ display: ' none' });

    const [modalStateStyle, setModalStateStyle] = useState({ display: ' none' });

    const [userSearch, setUserSearch] = useState('');

    const userInterest = ['전체', '유저', '관리자'];

    const users = ['닉네임', '이름', '이메일'];

    const [selectedView, setSelectedView] = useState("전체");

    const [selectedOption, setSelectedOption] = useState("닉네임");

    const [isOpen, setIsOpen] = useState(false);

    const [isOpenOption, setIsOpenOption] = useState(false);

    const [isOpenUserAuth, setIsOpenUserAuth] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const itemsPerPage = 10; // 페이지당 유저 수

    const optionToFieldMap = {
        닉네임: 'userNickName',
        이름: 'userName',
        이메일: 'userEmail',
    };
    
    const filteredUsers = allUser.filter(user => {
        const isAuthMatched =
            selectedView === '전체' ||
            (selectedView === '유저' && user.userAuth === 'ROLE_USER') ||
            (selectedView === '관리자' && user.userAuth === 'ROLE_ADMIN');
    
        const searchField = optionToFieldMap[selectedOption];
        const isSearchMatched = !userSearch || (user[searchField] && user[searchField].toLowerCase().includes(userSearch.toLowerCase()));
    
        return isAuthMatched && isSearchMatched;
    });
    
    

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const getAllUser = () => {
        axios.get('/user/api/getUserListAll').then(response => setAllUser(response.data));
    };

    useEffect( () => {getAllUser()}, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const toggleDropdownO = () => {
        setIsOpenOption(!isOpenOption);
    };
    
    const toggleDropdownU = () => {
        setIsOpenUserAuth(!isOpenUserAuth);
    };

    const handleViewSelect = (inter) => {
        setSelectedView(inter);
        setIsOpen(false);
    };

    const handleMonthSelect = (user) => {
        setSelectedOption(user);
        setIsOpenOption(false);
    };
    
    const handleMonthSelectAuth = (Auth) => {
        setTargetUser(prev => ({
            ...prev,
            userAuth : Auth === '일반 유저' ? 'ROLE_USER' : 'ROLE_ADMIN'}));
        setIsOpenUserAuth(false);
    };

    const handleChageInput = (e) => {
        const searchValue = e.target.value;
        setUserSearch(searchValue);
    };

    // 드롭다운 외부 클릭 핸들러
    const handleClickOutside = (e) => {
        const dropdown1 = document.getElementById('dropdown1'); // 첫 번째 드롭다운
        const dropdown2 = document.getElementById('dropdown2'); // 두 번째 드롭다운

        if (
            dropdown1 && !dropdown1.contains(e.target) &&
            dropdown2 && !dropdown2.contains(e.target)
        ) {
            setIsOpen(false);
            setIsOpenOption(false);
        }
    };

    useEffect(() => {
        // 외부 클릭 이벤트 리스너 등록
        window.addEventListener('click', handleClickOutside);

        return () => {
            // 컴포넌트 언마운트 시 리스너 제거
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleContextMenu = (e, user) => {
        e.preventDefault();
        const modalPosition = {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            display: 'block',
        }

        setTargetUser(user);
        setModalStyle(modalPosition);
        setModalStateStyle({display : 'none'});
    }

    const handleClickOutSide = (e) => {
        const modal = document.getElementById('rightModal');
        if (modal && !modal.contains(e.target)) {
            setModalStyle({ display: 'none' });
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutSide);
        return () => {
            window.removeEventListener('click', handleClickOutSide);
        }
    }, []);

    const handleClickMenu = (e) => {
        const targetId = e.target.id;
        if(targetId === 'userDelete'){
            showConfirm();
        }else if(targetId === 'stateModal'){
            const modalPosition = {
                left : modalStyle.left,
                top : modalStyle.top,
                display : 'flex'
            }

            setModalStateStyle(modalPosition);
        }
    }

    const handleChageUserAuth = () => {
        axios.get(`/user/api/updateUserAuth?userAuth=${targetUser.userAuth}&userCode=${targetUser.userCode}`)
            .then(response => {
                if(response.data === 'success'){
                    setModalStateStyle({display : 'none'});
                    getAllUser();
                }else {
                    alert('실패');
                    return;
                }
            });
    }

    const [confirmVisible, setConfirmVisible] = useState(false);

    const showConfirm = () => {
        setConfirmVisible(true);
    };

    const handleConfirm = () => {
        setConfirmVisible(false);
        axios.get(`/user/api/deleteUserData?userCode=${targetUser.userCode}`)
            .then(response => {
                if(response.data === 'success'){
                    getAllUser();
                }else {
                    alert('실패');
                    return;
                }
            });
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };
    return (
        <Container>
            <MainArea className='backgCon'>
                <h2>Admin Page - 회원 관리</h2>
                <HeaderDiv>
                    <p>총 회원 수 : {allUser.length} 명</p>
                    <SearchSection>
                        <DateBox>
                            <DropdownBox id="dropdown1" style={{width : '100px'}}>
                                <SelectedItem onClick={toggleDropdown}>{selectedView}</SelectedItem>
                                <DropdownList isOpen={isOpen}>
                                    {userInterest.map((inter) => (
                                        <DropdownItem key={inter} onClick={() => handleViewSelect(inter)}>
                                        {inter}
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            </DropdownBox>
                        </DateBox>
                        <DateBox>
                        <DropdownBox id="dropdown2" style={{marginRight : '5px'}}>
                                <SelectedItem onClick={toggleDropdownO}>{selectedOption}</SelectedItem>
                                <DropdownList isOpen={isOpenOption}>
                                {users.map((u) => (
                                    <DropdownItem key={u} onClick={() => handleMonthSelect(u)}>
                                    {u}
                                    </DropdownItem>
                                ))}
                                </DropdownList>
                            </DropdownBox>
                        </DateBox>
                        <UserInputSection>
                            <input type="text" name="userSearch" value={userSearch} placeholder='검색어를 입력해주세요' onChange={handleChageInput}/>
                        </UserInputSection>
                    </SearchSection>
                </HeaderDiv>
                {allUser.length > 0 ? 
                    <table className='backgCon' style={{width : '94.5%', maxHeight : '70%', margin : '1.3%', marginLeft : '3%'}}>
                        <thead>
                            <tr className='backgCon' style={{borderRadius : '15px'}}>
                                <th>번호</th>
                                <th>이름</th>
                                <th>닉네임</th>
                                <th>이메일</th>
                                <th>전화번호</th>
                                <th>가입날짜</th>
                                <th>권한</th>
                            </tr>
                        </thead>
                        <tbody>
                        {paginatedUsers.map((user, index) => (
                        <tr key={index} style={{ textAlign: 'center'}} onContextMenu={(e) => handleContextMenu(e, user)}>
                            <td>{user.userCode}</td>
                            <td style={{ width: '130px' }}>{user.userName}</td>
                            <td style={{ width: '150px' }}>{user.userNickName}</td>
                            <td style={{ width: '230px' }}>{user.userEmail}</td>
                            <td>{user.userPhone}</td>
                            <td>{new Date(user.registerDate).toLocaleDateString('en-CA')}</td>
                            <td style={{ width: '130px' }}>{user.userAuth}</td>
                        </tr>
                    ))}
                        </tbody>
                    </table>
                    :
                    <div>

                    </div>
                }
                <div style={{ textAlign: 'center', margin: '20px', bottom : '2%', position : 'absolute', right : '32%' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            backgroundColor: page === currentPage ? '#232428' : '#FFF',
                            color: page === currentPage ? '#FFF' : '#000',
                            border: '1px solid #007BFF',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {page}
                    </button>
                ))}
                </div>
                <RightModal id="rightModal" style={{ ...modalStyle }} >
                    <RightModalDiv id='stateModal' onClick={handleClickMenu}>유저 권한 변경</RightModalDiv>  
                    <RightModalDiv id='userDelete' onClick={handleClickMenu}>유저 삭제</RightModalDiv>  
                </RightModal> 
                <RoleChangeUserModal style={{ ...modalStateStyle }}>
                    <div style={{display : 'flex', marginTop : '40px'}}>
                    {
                        targetUser !== null &&
                        <DateBox>
                        <DropdownBox id="dropdown2" style={{marginRight : '5px'}}>
                            <SelectedItem onClick={toggleDropdownU}>{targetUser.userAuth === 'ROLE_USER' ? '일반 유저' : '관리자'}</SelectedItem>
                            <DropdownList isOpen={isOpenUserAuth}>
                            {['일반 유저', '관리자'].map((u) => (
                                <DropdownItem key={u} onClick={() => handleMonthSelectAuth(u)}>
                                {u}
                                </DropdownItem>
                            ))}
                            </DropdownList>
                        </DropdownBox>
                    </DateBox>
                    }
                    <PasswordUpdate  onClick={handleChageUserAuth}>완료</PasswordUpdate>
                    </div>
                    <CloseBtn onClick={() => {setModalStateStyle({display : 'none'});}}>&times;</CloseBtn>
                </RoleChangeUserModal>
            </MainArea>
            {targetUser !== null && confirmVisible && <Confirm message={'정말 ' + targetUser.userNickName + '님의 계정을 삭제하시겠습니까?'} onConfirm={handleConfirm} onCancel={handleCancel} />}
        </Container>
    );
}
const RoleChangeUserModal = styled.div`
    justify-content: center;
    color: aliceblue;
    position: absolute;
    background-color: rgba(29, 29, 29, 0.9);
    box-sizing: border-box; 
    border-radius: 3%;
    border: 0.3px solid rgba(212, 201, 201, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    flex-direction: row;
    width: 300px;
    height: 100px;
    
`;

const PasswordUpdate = styled.button`
    background-color: rgba(248, 244, 244, 0.1);
    color: #01CD9A;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
    padding: 10px;
    font-size : 200;
    width: 75px;
    height: 43px;
    &:hover {
        transform: scale(1.05);
    }
`;

const CloseBtn = styled.div`
    border-radius : 50%;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    width : 20px;
    height : 20px;
    top: 2%;
    right: 2%;
    cursor: pointer;
`;

const RightModal = styled.div`
  justify-content: center;
  color: aliceblue;
  position: absolute;
  background-color: rgba(29, 29, 29, 0.9);
  box-sizing: border-box; 
  border-radius: 3%;
  border: 0.3px solid rgba(212, 201, 201, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
`

const RightModalDiv = styled.div`
    box-sizing: border-box;
    margin: 10px;
    font-size: 13px;  /* 글자 크기 작게 */
    letter-spacing: -0.5px;  /* 자간을 줄임 */
    flex: 1;

    &:hover {
        color:#01CD9A;
        cursor: pointer;
    }
`

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    `;

const MainArea = styled.div`
    background-color: rgba(30, 31, 34, 0.7);
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 20px;
    overflow-y: auto;

    h2 {
        margin-left: 3%;
    }
    p {
        margin-left: 3%;
    }

    table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
    }  

    tr {
        height: 60px;
    }

    td {
        overflow: hidden;
    }


    th {
        font-weight: 550;
    }
    tr:hover {
        background-color: rgba(29, 29, 31, 0.5);
        /* border-bottom: 1px solid rgba(29, 29, 31); */
    }
`;


const HeaderDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SearchSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 35px;
`;

const DropdownBox = styled.div`
  position: relative;
  width: 100px;
  color: white;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SelectedItem = styled.div`
  padding: 10px;
  background-color: #232428;
  cursor: default;
  font-size: 16px;
  text-align: center;
  border-radius: 4px;
  border: 1px solid rgba(212, 201, 201, 0.3);
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: #232428;
  z-index: 10;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const DropdownItem = styled.div`
  padding: 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #6e6868;
  }
`;

const DateBox = styled.div`
  /* display: flex;
  flex-direction: row;
  justify-content: space-between; */
  margin-right: 15px;
`;

const UserInputSection = styled.div`
    width: 90%;
    height: 20%;
    input[type='text']{
        width: 395px;
        height: 40px;
        background-color: #232428;
        border-radius: 4px;
        border: none;
        color: white;
        padding-left: 10px;
    }
`;


export default AdminUser;