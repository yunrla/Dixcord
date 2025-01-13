// server/models/vo/CallHistoryVO.js

class CallHistoryVO {
  constructor(callChatNo, userCode, userIcon, callState, callStart, callEnd) {
    this.callChatNo = callChatNo;
    this.userCode = userCode;
    this.userIcon = userIcon;
    this.callState = callState;
    this.callStart = callStart;
    this.callEnd = callEnd;
  }

  // DB에서 가져온 row 데이터를 VO 객체로 변환
  static fromDbRow(row) {
    return new CallHistoryVO(
      row.CALLCHATNO,    // callChatNo (NUMBER)
      row.USERCODE,      // userCode (NUMBER)
      row.USERICON,      // userIcon (VARCHAR2)
      row.CALLSTATE,     // callState (VARCHAR2)
      row.CALLSTART,     // callStart (TIMESTAMP)
      row.CALLEND        // callEnd (TIMESTAMP)
    );
  }

  // VO 객체를 클라이언트에 맞는 형식으로 변환
  toClientFormat() {
    return {
      callChatNo: this.callChatNo,
      userCode: this.userCode,
      userIcon: this.userIcon,
      callState: this.callState,
      callStart: this.callStart.toISOString(),  // 날짜 형식을 ISO 문자열로 변환
      callEnd: this.callEnd ? this.callEnd.toISOString() : null  // null 처리를 해줍니다.
    };
  }
}

module.exports = CallHistoryVO;
