const { connectToOracle } = require('../db');

// 전화방에 있는 사람들 불러오는 쿼리문
async function getCallHistoryByChatNo(params) {
  const dbConnection = await connectToOracle();

  const { callChatNo } = params;

  const result = await dbConnection.execute(
    `SELECT * FROM dico_callhistory WHERE callChatNo = :callChatNo`,
    [callChatNo],
    { outFormat : dbConnection.OBJECT }
  );

  return result.rows; 
}

module.exports = {
  getCallHistoryByChatNo
};

