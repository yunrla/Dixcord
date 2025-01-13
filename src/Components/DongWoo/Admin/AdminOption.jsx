import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Alert from '../../Alert/Alert';
import Confirm from '../../Alert/Confirm';
import RoomMemberModal from './RoomMemberModal';

function AdminOption(props) {
    const [allRooms, setAllRooms] = useState([]);
    const [targetRoom, setTargetRoom] = useState(null);
    const [roomMember, setRoomMember] = useState([]);
    const [modalStyle, setModalStyle] = useState({ display: 'none' });
    const [modalStateStyle, setModalStateStyle] = useState({ display: 'none' });
    const [roomSearch, setRoomSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredRooms = allRooms.filter((room) => {
        return !roomSearch || (room.roomTitle && room.roomTitle.toLowerCase().includes(roomSearch.toLowerCase()));
    });

    const paginatedRooms = filteredRooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const getAllRooms = () => {
        axios.get('/api/room/allList')
            .then((response) => setAllRooms(response.data.filter((room) => room.roomNumber < 9999)));
    };

    useEffect(() => {
        getAllRooms();
    }, []);

    const handleContextMenu = (e, room) => {
        e.preventDefault();
        const modalPosition = {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            display: 'block',
        };

        setTargetRoom(room);
        setModalStyle(modalPosition);
        setModalStateStyle({ display: 'none' });
    };

    const handleClickOutside = (e) => {
        const modal = document.getElementById('rightModal');
        if (modal && !modal.contains(e.target)) {
            setModalStyle({ display: 'none' });
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSearchInputChange = (e) => {
        const searchValue = e.target.value;
        setRoomSearch(searchValue);
    };

    const [confirmVisible, setConfirmVisible] = useState(false);

    const showConfirm = () => {
        setConfirmVisible(true);
    };

    const handleMember = () => {
        setRoomMember([]);
        axios.get(`/api/room/getChatMember/${targetRoom.roomNumber}`)
            .then(response => {
                if(response.data.length > 0){
                    response.data.forEach(mem => {
                      axios.get(`api/room/getMemberInfo/${mem.userCode}`)
                        .then(response2 => {
                          setRoomMember(prevData => [...prevData, response2.data]);
                          setModalVisible(true);
                        });
                    })
                  }
            })
    }

    const handleConfirm = () => {
        setConfirmVisible(false);
        axios.get(`/admin/api/deleteRoom?roomNumber=${targetRoom.roomNumber}`)
            .then((response) => {
                if (response.data > 0) {
                    getAllRooms();
                } else {
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
            <MainArea className="backgCon">
                <h2>Admin Page - 방 관리</h2>
                <HeaderDiv>
                    <p>총 방 수 : {allRooms.length} 개</p>
                    <SearchSection>
                        <UserInputSection>
                            <input
                                type="text"
                                name="roomSearch"
                                value={roomSearch}
                                placeholder="방 제목을 입력해주세요"
                                onChange={handleSearchInputChange}
                            />
                        </UserInputSection>
                    </SearchSection>
                </HeaderDiv>
                {allRooms.length > 0 ? (
                    <table className="backgCon" style={{ width: '94.5%', maxHeight: '70%', margin: '1.3%', marginLeft: '3%' }}>
                        <thead>
                            <tr className="backgCon" style={{ borderRadius: '15px' }}>
                                <th>방 번호</th>
                                <th>방 제목</th>
                                <th>카테고리</th>
                                <th>초대코드</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRooms.map((room, index) => (
                                <tr
                                    key={index}
                                    style={{ textAlign: 'center' }}
                                    onContextMenu={(e) => handleContextMenu(e, room)}
                                >
                                    <td>{room.roomNumber}</td>
                                    <td style={{ width: '130px' }}>{room.roomTitle}</td>
                                    <td style={{ width: '130px' }}>{room.roomCategory}</td>
                                    <td style={{ width: '230px' }}>{room.welcomeMessage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div></div>
                )}
                <div style={{ textAlign: 'center', margin: '20px', bottom: '2%', position: 'absolute', right: '32%' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                                cursor: 'pointer',
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <RightModal id="rightModal" style={{ ...modalStyle }}>
                    <RightModalDiv id="roomTogether" onClick={handleMember}>
                        방 맴버 보기
                    </RightModalDiv>
                    <RightModalDiv id="roomDelete" onClick={showConfirm}>
                        방 삭제
                    </RightModalDiv>
                </RightModal>
                {confirmVisible && (
                    <Confirm
                        title="방 삭제"
                        message="정말로 삭제하시겠습니까?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
                {modalVisible && (
        <RoomMemberModal
          members={roomMember}
          onClose={() => setModalVisible(false)}
        />
      )}
            </MainArea>
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


export default AdminOption;