// server/controllers/callHistoryController.js
const { getCallHistoryByChatNo } = require('../models/callHistoryModel');  // 모델 불러오기

// callChatNo에 해당하는 호출 기록을 조회하는 핸들러
async function getCallHistoryByChatNoHandler(req, res) {
  const { callChatNo } = req.params;  // URL에서 callChatNo 가져오기

  try {
    // 모델에서 데이터를 가져옴
    const callHistory = await getCallHistoryByChatNo(callChatNo);

    if (callHistory.length > 0) {
      res.json(callHistory);  // 데이터가 있으면 응답
    } else {
      res.status(404).send('Call history not found');  // 데이터가 없으면 404
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');  // 서버 오류
  }
}

module.exports = {
  getCallHistoryByChatNoHandler
};
