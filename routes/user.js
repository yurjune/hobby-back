const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Image } = require('../models');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + '_' + new Date().getTime() + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// 매번 사용자 정보 복구(새로고침 해도 로그인 유지)
router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Image,
        }]
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

// 팔로우
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

// 언팔로우
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

// 프로필 사진 등록
router.post('/image', upload.single('profile'), async (req, res, next) => {
  try {
    const file = req.file.filename;
    return res.send(file);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 프로필 정보 변경
router.post('/profile', async (req, res, next) => {
  try {
    const exUser = await User.findOne({ where: { id: req.body.userId }});
    if (!exUser) return res.status(403).send('사용자가 존재하지 않습니다');
    if (req.body.profileImage) {
      // 기존 프로필 사진을 삭제후 새로 등록한다
      const prevImage = await exUser.getImage();
      await Image.destroy({ where: { src: prevImage.dataValues.src } })
      const image = await Image.create({
        src: req.body.profileImage,
      });
      await exUser.setImage(image);
    }
    await User.update({
      name: req.body.name,
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