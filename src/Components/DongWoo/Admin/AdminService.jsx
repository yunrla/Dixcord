import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Confirm from '../../Alert/Confirm';

function AdminService({getUser}) {

    const [inquiryAll, setInquiryAll] = useState([]);

    const [userSearch, setUserSearch] = useState('');
    
    const userInterest = ['전체', '처리 전', '처리 완료'];

    const users = ['내용', '유저명'];

    const [selectedView, setSelectedView] = useState("전체");

    const [selectedOption, setSelectedOption] = useState("내용");

    const [isOpen, setIsOpen] = useState(false);

    const [isOpenOption, setIsOpenOption] = useState(false);

    const [modalStyle, setModalStyle] = useState({display : 'none'});

    const [targetInq, setTargetInq] = useState(null);
    
    const [confirmVisible, setConfirmVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
        const itemsPerPage = 5; // 페이지당 유저 수
    
        const optionToFieldMap = {
            내용: 'content',
            유저명: 'userName',
        };
        
        const filteredUsers = inquiryAll.filter(user => {
            const isAuthMatched =
                selectedView === '전체' ||
                (selectedView === '처리 전' && user.inquiryState === '처리 전') ||
                (selectedView === '처리 완료' && user.inquiryState === '처리 완료');
        
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

    const getInquriyAll = () => {
        axios.get('/admin/api/getAllInquiry')
            .then(response => {
                setInquiryAll(response.data);
            });
    }

    const [expandedQuestionIds, setExpandedQuestionIds] = useState(new Set());
        const maxLength = 20; // 텍스트가 100자를 초과할 경우 펼치기 버튼을 보여줌
    
        const toggleExpand = (inquiryNo) => {
            setExpandedQuestionIds((prevState) => {
                const newState = new Set(prevState);
                if (newState.has(inquiryNo)) {
                    newState.delete(inquiryNo);
                } else {
                    newState.add(inquiryNo);
                }
                return newState;
            });
        };


    useEffect( () => {
        getInquriyAll();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const toggleDropdownO = () => {
        setIsOpenOption(!isOpenOption);
    };

    const handleViewSelect = (inter) => {
        setSelectedView(inter);
        setIsOpen(false);
    };

    const handleMonthSelect = (user) => {
        setSelectedOption(user);
        setIsOpenOption(false);
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

    
    const handleClickInquiry = (e, inq) => {

        if(targetInq !== null){
            if(document.querySelector(`#inq${targetInq.inquiryNo}`)){
                document.querySelector(`#inq${targetInq.inquiryNo}`).style.display = 'none';
            }
        }
        
        const modalPosition = {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            display: 'block',
        }

        setTargetInq(inq);
        setModalStyle(modalPosition);
    }
    
    useEffect(() => {
            // 외부 클릭 이벤트 리스너 등록
            window.addEventListener('click', handleClickOutside);
    
            return () => {
                // 컴포넌트 언마운트 시 리스너 제거
                window.removeEventListener('click', handleClickOutside);
            };
        }, []);

    const handleMessage = () => {
        setModalStyle({display : 'none'});
        document.querySelector(`#inq${targetInq.inquiryNo}`).style.display = 'block';
    }

    const handleDelete = () => {
        // 컨펌창
        setConfirmVisible(true);
    }


    const handleConfirm = () => {
        setModalStyle({display : 'none'});
        setConfirmVisible(false);
        axios.get(`/admin/api/deleteInquiryByAdmin?inquiryNo=${targetInq.inquiryNo}`)
            .then(response => {
                if(response.data > 0){
                    getInquriyAll();
                }else {
                    alert('실패');
                    return;
                }
            });
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };

    const handleMessagecomplete = () => {
        // 완료 버튼
        const messageData = {
            inquiryNo : targetInq.inquiryNo,
            userCode : getUser.userCode,
            userName : getUser.userNickName,
            message : document.querySelector(`#inqtext${targetInq.inquiryNo}`).value
        };
        axios.post('/admin/api/setInquiryAdminMessage', messageData)
            .then(response => {
                if(response.data > 0){
                    alert('답변 작성이 완료되었습니다.');
                    document.querySelector(`#inq${targetInq.inquiryNo}`).style.display = 'none';
                    getInquriyAll();
                    return;
                }else {
                    alert('문제가 발생하였습니다. 다시 시도해주세요');
                    return;
                }
            })
    }

    return (
        <Container>
            <MainArea className='backgCon'>
                <h2>Admin Page - 문의 관리</h2>
                <HeaderDiv>
                    <p>총 문의 수 : {inquiryAll.length} 개</p>
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
                {inquiryAll.length > 0 && 
                    paginatedUsers.map((inq, index) => {
                        const isLongText = inq.content.length > maxLength;
                        return inq.inquiryState === '처리 전' ? 
                        <div>
                            <div style={{marginLeft : '1.5%'}}>
                                <StyledListItem key={inq.inquiryNo} onClick={(e) => handleClickInquiry(e, inq)}>
                                    <StyledImage src="/images/ydh/questionIcon.png" />
                                    <h3>{inq.userName}님 </h3>
                                    <StyledSpan
                                        className="content"
                                        isExpanded={expandedQuestionIds.has(inq.inquiryNo)}
                                        >
                                        {isLongText
                                            ? expandedQuestionIds.has(inq.inquiryNo)
                                            ? inq.content
                                            : inq.content.slice(0, maxLength) + "..."
                                            : inq.content}
                                    </StyledSpan>
                                    <StyledSpan className="category">{inq.category}</StyledSpan>
                                    <StyledSpan className="inquiryDate">{new Date(inq.inquiryDate).toLocaleDateString('en-CA')}</StyledSpan>
                                    {inq.inquiryState === '처리 전' ? <StyledSpan className="state" style={{color : '#808080'}}>[처리 중]</StyledSpan> : <StyledSpan className="category" style={{color : '#01CD9A'}}>[처리 완료]</StyledSpan>}
                                    {isLongText && (
                                        <ExpandButton onClick={() => toggleExpand(inq.inquiryNo)}>
                                            {expandedQuestionIds.has(inq.inquiryNo) ? '△' : '▽'}
                                        </ExpandButton>
                                    )}
                                </StyledListItem>
                            </div> 
                            <UserInputSection2 id={'inq' + inq.inquiryNo} style={{display : 'none'}}>
                                <input id={'inqtext' + inq.inquiryNo} type="text" placeholder='답변 내용 입력'/>
                                <button onClick={handleMessagecomplete}>완료</button>
                                <button style={{color : 'red'}} onClick={() => document.querySelector(`#inq${inq.inquiryNo}`).style.display = 'none'}>취소</button>
                            </UserInputSection2>
                        </div>
                        : 
                        <div style={{marginLeft : '1.5%'}}>
                            <StyledListItem key={inq.inquiryNo}>
                                <StyledImage src="/images/ydh/questionIcon.png" />
                                <h3>{inq.userName}님 </h3>
                                <StyledSpan
                                    className="content"
                                    isExpanded={expandedQuestionIds.has(inq.inquiryNo)}
                                >
                                    {isLongText
                                        ? expandedQuestionIds.has(inq.inquiryNo)
                                        ? inq.content
                                        : inq.content.slice(0, maxLength) + "..."
                                        : inq.content}
                                </StyledSpan>
                                <StyledSpan className="category">{inq.category}</StyledSpan>
                                <StyledSpan className="inquiryDate">{new Date(inq.inquiryDate).toLocaleDateString('en-CA')}</StyledSpan>
                                {inq.inquiryState === '처리 전' ? <StyledSpan className="state" style={{color : '#808080'}}>[처리 중]</StyledSpan> : <StyledSpan className="category" style={{color : '#01CD9A'}}>[처리 완료]</StyledSpan>}
                                {isLongText && (
                                    <ExpandButton onClick={() => toggleExpand(inq.inquiryNo)}>
                                        {expandedQuestionIds.has(inq.inquiryNo) ? '△' : '▽'}
                                    </ExpandButton>
                                )}
                            </StyledListItem>
                        </div> 
                    })
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
            </MainArea>
            <RightModal id="rightModal" style={{ ...modalStyle }} >
                <RightModalDiv id='stateModal' onClick={handleMessage}>문의 답변</RightModalDiv>  
                <RightModalDiv id='userDelete' onClick={handleDelete}>문의 삭제</RightModalDiv>  
            </RightModal> 
            {targetInq !== null && confirmVisible && <Confirm message={'정말 ' + targetInq.userName + '님의 문의를 삭제하시겠습니까?'} onConfirm={handleConfirm} onCancel={handleCancel} />}
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
    h2 {
        margin-left: 3%;
    }
    p {
        margin-left: 3%;
    }
`;

const StyledListItem = styled.li`
    display: flex;
    align-items: center;
    border: 1px solid #01CD9A;
    margin: 20px;
    border-radius: 6px;
    padding: 10px;
    &:hover {
        cursor: pointer;
        background-color: rgba(30, 31, 34, 0.7);
    }
`;

const StyledImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    margin: 10px;
    border-radius: 50%;
`;

const StyledSpan = styled.span`
    display: inline-block;
    margin-left: 10px;
    max-width: 70%; /* 텍스트의 가로 길이를 제한 */

    &.content {
        font-size: 20px;
        white-space: ${(props) => (props.isExpanded ? 'normal' : 'nowrap')}; /* 펼쳐졌을 때 여러 줄로 보이도록 */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &.category {
        font-size: 12px;
    }

    &.inquiryDate {
        font-size: 12px;
    }

    &.state {
        font-size : 12px;
    }
`;

const ExpandButton = styled.button`
    background: none;
    border: none;
    color: #01CD9A;
    cursor: pointer;
    font-size: 18px;
    margin-left: 20px;
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

const UserInputSection2 = styled.div`
    width: 90%;
    height: 20%;
    margin-left: 100px;
    border-bottom: 1px solid white;
    border-left: 1px solid white;
    border-radius: 5px;
    input[type='text']{
        width: 395px;
        height: 40px;
        background-color: #232428;
        border-radius: 4px;
        border: none;
        color: white;
        padding-left: 10px;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    button {
        background-color: rgba(27, 25, 25, 0.7);
        color: #01CD9A;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s ease;
        padding: 10px;
        font-size : 200;
        width: 75px;
        height: 43px;
        margin-left: 5px;
        &:hover {
            transform: scale(1.05);
        }
    }
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

const ModalArea = styled.div`
    display: flex;
    position: fixed;
    width: 200px;
    height: 200px;
    background-color: rgba(29, 27, 27, 0.7);
`;

export default AdminService;