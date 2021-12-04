const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      // include: [{
      //   model: User,
      //   attributes: ['id', 'name'],
      //   as: 'Followers',
      // }, {
      //   model: User,
      //   attributes: ['id', 'name'],
      //   as: 'Followings',
      // }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  local();
};