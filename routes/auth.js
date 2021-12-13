const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express();

router.post('/join', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const exUser = await User.findOne({ where: { email, }});
    if (exUser) {
      return res.status(403).send('이미 존재하는 이메일입니다!');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      name,
      password: hash,
    });
    return res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.status(201).send('ok');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  return res.status(200).send('ok');
});

module.exports = router;
