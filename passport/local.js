const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (!exUser) {
        return done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
      const result = await bcrypt.compare(password, exUser.password);
      if (!result) {
        return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      }
      done(null, exUser);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};