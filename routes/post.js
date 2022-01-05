const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Post, Image, Comment, Hashtag } = require('../models');

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

// 게시글 업로드
router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create({
      UserId: req.body.id,
      content: req.body.content,
      time: req.body.time,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[#노드, true], [#리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }
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
    return res.send(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 글 수정하기
router.patch('/editpost', async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.postId }});
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    await Post.update({
      content: req.body.content,
    },{ 
      where: { id: req.body.postId },
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[#노드, true], [#리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }
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
    return res.send('success');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 글 삭제
router.delete('/', async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.query.postId }});
    if (!post) return res.status(403).send('게시글이 존재하지 않습니다!');
    // Image.destroy가 Post.destroy보다 먼저 실행되야 삭제되는듯
    await Image.destroy({ where: { PostId: req.query.postId } });
    await Post.destroy({ where: { id: req.query.postId }, });
    return res.send('삭제되었습니다');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
