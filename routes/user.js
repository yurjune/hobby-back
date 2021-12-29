const express = require('express');
const router = express();
const { User } = require('../models');

// 매번 사용자 정보 복구(새로고침 해도 로그인 유지)
router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
      });
      return res.status(200).json(fullUserWithoutPassword);
    } else {
      return res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/follow', async (req, res, next) => {
  try {
    const followingUser = await User.findOne({
      where: { id: req.body.followingId },
      attributes: ['id', 'name'],
    });
    if (!followingUser) return res.status(403).send('없는 사용자입니다');
    const followers = await followingUser.getFollowers();
    console.log('get:', followers);
    console.log('get:', followers.dataValues);
    await followingUser.addFollowers(req.body.followerId);
    return res.json(followingUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/follow', async (req, res, next) => {
  try {
    const followingId = parseInt(req.query.followingId, 10);
    const followerId = parseInt(req.query.followerId, 10);
    const followingUser = await User.findOne({ where: { id: followingId }});

    if (!followingUser) return res.status(403).send('없는 사용자입니다');
    await followingUser.removeFollowers(followerId);
    return res.json(followingUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/time', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.query.email },
      attributes: ['id', 'time'],
    });
    return res.send(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/time', async (req, res, next) => {
  try {
    console.log(req.body.userId)
    console.log(req.body.time)
    const user = await User.findOne({ where: { id: req.body.userId }});
    if (!user) return res.status(403).send('사용자가 존재하지 않습니다!');
    await User.update({
      time: req.body.time,
    }, {
      where: { id: req.body.userId },
    });
    return res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;