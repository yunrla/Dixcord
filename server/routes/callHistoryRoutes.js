// server/routes/callHistoryRoutes.js
const express = require('express');
const { getCallHistoryByChatNoHandler } = require('./controllers/callHistoryController');  // 컨트롤러 불러오기
const router = express.Router();

// 특정 callChatNo에 대한 호출 기록 조회
router.get('/callHistory/:callChatNo', getCallHistoryByChatNoHandler);

module.exports = router;
