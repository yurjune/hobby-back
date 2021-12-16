const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: '/socket.io',
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    }
  });
  app.set('io', io);
  const time = io.of('/time');

  let now = 0;
  let timer;

  const runTimer = (socket) => {
    timer = setInterval(() => {
      now += 1;
      socket.emit('running', { time: `${now}`, });
    }, 1000);
  };

  time.on('connection', (socket) => {
    console.log('time 네임스페이스에 접속');

    socket.on('start', () => {
      console.log('실행하기');
      runTimer(socket);
    });

    socket.on('stop', () => {
      console.log('일시정지');
      clearInterval(timer);
    });

    socket.on('disconnect', () => {
      console.log('time 네임스페이스 접속 해제');
    });
  });
};