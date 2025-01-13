import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { qnaChatConfigData, qnaSecurityConfigData, qnaServerConfigData, qnaUserConfigData } from '../../../data/qna';
import ServiceSearch from './ServiceSearch';

const Area = styled.div`
    background-color: rgba(30, 31, 34, 0.7); /* 80% 불투명 */
    width: 100%;
    margin: 10px;
    margin-left: 0;
    border-radius: 10px;
    color: white;   
    overflow-y: auto;
`

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-direction: column; /* 기본적으로 세로 정렬 */
  }

  .noticeHeader {
    justify-content: space-between; /* 양 끝 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
    margin-bottom: 8px; /* 제목과 내용 사이 간격 */
  }

  strong {
    font-size: 1.2rem;
    color: #f1f1f1;
  }

  .noticeDay {
    font-size: 0.9rem;
  }

  .noticeContent {
    margin-top: 4px; /* 제목 영역과 약간의 간격 */
  }
`;

const StyledImage = styled.img`
    width: 250px; 
    height: 150px;
    object-fit: cover; 
    margin: 10px;
    
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 50%;
`;

const ServiceSearchPage = ({getUser}) => {
  const [noticeResults, setNoticeResults] = useState([]);
  const [qnaResults, setQnaResults] = useState([]);
  const [searchParams] = useSearchParams();
  const [attachments, setAttachments] = useState({}); // 첨부파일 정보를 저장
  const nav = useNavigate();

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      // 공지사항 검색 (백엔드 요청)
      axios
        .get(`/api/service/search?keyword=${encodeURIComponent(keyword)}`)
        .then((response) => setNoticeResults(response.data))
        .catch((error) => console.error(error));

      // Q&A 검색 (qna.js 데이터)
      const allQnaData = [
        ...qnaUserConfigData,
        ...qnaServerConfigData,
        ...qnaChatConfigData,
        ...qnaSecurityConfigData,
      ];
      const filteredQna = allQnaData.filter(
        (item) =>
          item.q.toLowerCase().includes(keyword.toLowerCase()) ||
          item.a.toLowerCase().includes(keyword.toLowerCase())
      );
      setQnaResults(filteredQna);
    }
  }, [searchParams]);

  const handleItemClick = (idx) => {
    nav(`/service/notice/${idx}`);
  };

  const getAttachList = async (idx) => {
    try {
        const resp = await axios.get(`/getAttachList/${idx}`);
        const data = resp.data;
        setAttachments((prev) => ({ ...prev, [idx]: data })); // 상태에 각 idx별 데이터 저장
    } catch (error) {
        console.error("첨부파일 리스트 가져오기 에러 발생:", error);
    }
  };

  useEffect(() => {
    
    if (noticeResults.length > 0) {
      noticeResults.forEach((notice) => {
            getAttachList(notice.idx); // 각 게시글의 첨부파일 호출
            console.log(notice.roomTitle);
        });
    }
  }, [noticeResults]);

  const renderImage = (idx) => {
    const files = attachments[idx] || [];
    const imageFile = files.find((file) => {
        const extension = file.uploadName.split('.').pop().toLowerCase();
        return ['png', 'jpg', 'jpeg', 'gif'].includes(extension);
    });

    if (imageFile) {
        const fileUrl = `//DESKTOP-8UUQVVD/uploadImg/${imageFile.uploadPath}/${imageFile.uploadName}`;
        return <StyledImage src={fileUrl} alt={imageFile.uploadName} />;
    }
    return <StyledImage src="/images/ydh/default.jpeg" alt="default" />;
};

  return (
    <Area style={getUser === null ? {width : '70%', height : '70%',marginLeft : '15%'} : {width : '100%'}} className='backgCon'>
      <ServiceSearch/>
      <hr />
      <ResultsContainer>
        <h2>공지사항</h2>
        <ul>
          {noticeResults.length > 0 ? (
            noticeResults.map((search) => (
              <li className="noticeLi" key={search.idx} onClick={() => handleItemClick(search.idx)}>
                <FlexContainer>
                  {renderImage(search.idx)}
                  <div className="noticeHeader">
                    <span>{search.writer}</span>
                    <h2>{search.title}</h2>
                    <span className="noticeDay">{new Date(search.regDate).toLocaleDateString()}</span>
                  </div>
                </FlexContainer>
            </li>
            ))
          ) : (
            <p>검색된 공지사항이 없습니다.</p>
          )}
        </ul>

        {/* Q&A 섹션 */}
        <h2>Q & A</h2>
        <ul>
          {qnaResults.length > 0 ? (
            qnaResults.map((qna, index) => (
              <li key={index}>
                <strong>{qna.q}</strong>
                <p>{qna.a}</p>
              </li>
            ))
          ) : (
            <p>검색된 Q&A가 없습니다.</p>
          )}
        </ul>
      </ResultsContainer>
    </Area>
  );
};

export default ServiceSearchPage;
