const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./passport');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');
const app = express();

dotenv.config();
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comment');

const { sequelize } = require('./models/index'); // db.sequelize

sequelize.sync()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((error) => {
    console.error(error);
  });

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Resource-Policy")
  res.removeHeader("Cross-Origin-Embedder-Policy")
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://ec2-3-35-204-10.ap-northeast-2.compute.amazonaws.com',
    'http://ec2-3-35-204-10.ap-northeast-2.compute.amazonaws.com:3000'
  ],
  credentials: true,
}));

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
})
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/comment', commentRouter);

app.get('/', (req, res) => {
  res.send('hello express');
});

app.listen(3060, () => {
  console.log('3060 포트에서 대기중');
});
