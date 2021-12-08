const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./passport');
const app = express();
const path = require('path');
const clock = require('./util/clock');

dotenv.config();
const webSocket = require('./socket');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');

const { sequelize } = require('./models/index'); // db.sequelize

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((error) => {
    console.error(error);
  });

passportConfig();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);

const server = app.listen(3060, () => {
  console.log('3060번 포트에서 대기중');
});

webSocket(server);
