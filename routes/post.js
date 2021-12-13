const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Post, Image, Comment, Follow } = require('../models');

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
        },{
          model: User,
          as: 'Followers',
        }],
      },{
        model: Image,
      },{
        model: Comment,
        include: [{
          model: User,
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

// 대댓글 작성
router.post('/recomment', async (req, res, next) => {
  try {
    const targetComment = await Comment.findOne({
      where: { id: req.body.commentId },
    });
    if (!targetComment) return res.status(403).send('댓글이 존재하지 않습니다!');
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.body.postId,
      UserId: req.body.userId,
    });
    await comment.addFather(req.body.commentId);
    return res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 댓글 작성
router.post('/comment', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.body.postId }
    });
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.body.postId,
      UserId: req.body.userId,
    });
    return res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;