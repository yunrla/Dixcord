const oracledb = require('oracledb');

// Oracle DB 연결 설정
const dbConfig = {
  user: 'DIXCORD',
  password: '1234',
  connectString: '192.168.0.140:1521/XE', // SID 또는 서비스 이름
};

// Oracle DB 연결 함수
async function connectToOracle() {
  try {
    // 1. Oracle 클라이언트 라이브러리 경로 설정 (이 부분은 생략 가능, 환경변수로 설정 가능)
    // oracledb.initOracleClient({ libDir: 'C:\\instantclient_23_6' });

    // 2. DB 연결
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Oracle DB connected successfully!");
    return connection;
  } catch (error) {
    console.error("Error connecting to Oracle DB:", error);
    throw error;
  }
}

connectToOracle();

module.exports = { connectToOracle };
