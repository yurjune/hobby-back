const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Post, Image, Comment } = require('../models');

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

// 게시글 가져오기
router.get('/', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.query.id },
      include: [{
        model: User,
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'name'],
        },{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name'],
        }],
      },{
        model: User,
        as: 'Likers',
        attributes: ['id', 'name'],
      },{
        model: Image,
      },{
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'name'],
        },{
          model: Comment,
          as: 'Father',
        },{
          model: Comment,
          as: 'Son',
          include: [{
            model: User,
            attributes: ['id', 'name'],
          }]
        }],
      }],
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다!');
    }
    return res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 게시글 업로드
router.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const post = await Post.create({
      UserId: req.body.id,
      category: req.body.category,
      content: req.body.content,
    });
    if (req.body.image.length >= 1) {  // 이미지 첨부된 경우
      if (req.body.image.length >= 2) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image[0] });
        await post.addImages(image);
      }
    }
    return res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 이미지 업로드
router.post('/images', upload.array('image'), (req, res, next) => {
  console.log('req.files:', req.files);
  const files = req.files.map((file) => file.filename);
  return res.json(files);
});

// 좋아요
router.patch('/like', async (req, res, next) => {
  try {
    const postId = parseInt(req.query.postId, 10);
    const likerId = parseInt(req.query.likerId, 10);
    const post = await Post.findOne({ where: { id: postId, }});
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    await post.addLikers(likerId);
    return res.send('success');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch('/unlike', async (req, res, next) => {
  try {
    const postId = parseInt(req.query.postId, 10);
    const likerId = parseInt(req.query.likerId, 10);
    const post = await Post.findOne({ where: { id: postId, }});
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    await post.removeLikers(likerId);
    return res.send('success');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 수정할 글 불러오기
router.get('/editpost', async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      where: { id: req.query.postId },
      include: [{
        model: Image,
      },],
    });
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    res.send(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 글 수정하기
router.patch('/editpost', async (req, res, next) => {
  try {
    await Post.update({
      category: req.body.category,
      content: req.body.content,
    },{ 
      where: { id: req.body.postId },
    });
    const post = await Post.findOne({ where: { id: req.body.postId }});
    if (req.body.image.length >= 1) {  // 이미지 첨부된 경우
      await Image.destroy({ // 먼저 기존 이미지 지우기
        where: { postId: req.body.postId }
      });
      if (req.body.image.length >= 2) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image[0] });
        await post.addImages(image);
      }
    }
    res.send('success');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;