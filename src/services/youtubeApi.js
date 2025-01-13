import axios from 'axios';

const API_KEY = 'AIzaSyDisagn9M-tvac--A3sl6f2mloh2jWq8b8'; // Google Cloud에서 발급한 API Key
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// YouTube Data API를 사용하여 영상 데이터 가져오기
export const fetchTopResult = async (query) => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(
          query
        )}&key=${API_KEY}&maxResults=1`
      );
  
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }
  
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const topResult = data.items[0]; // 최상단 결과 가져오기
        return {
          id: topResult.id.videoId,
          title: topResult.snippet.title,
        };
      }
  
      return null; // 결과 없음
    } catch (error) {
      console.error('Error fetching top result from YouTube API:', error);
      return null;
    }
  };
  