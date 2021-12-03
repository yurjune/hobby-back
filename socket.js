const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server }); // express와 웹소켓 연결
  const clock = require('./util/clock');
  let hours;
  
  wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip);

    ws.on('message', (message) => { // 클라이언트로부터 메시지
      hours = message;
      console.log(hours?.toString());
    });
    ws.on('error', (error) => {
      console.error(error);
    });
    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval);
    });
    // ws.interval = setInterval(() => {
    //   if (ws.readyState === ws.OPEN) {
    //     ws.send(hours)
    //   }
    // }, 3000);
  });
};