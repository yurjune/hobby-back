const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Post, Image, Comment } = require('../models');

const router = express.Router();

// 댓글 작성
router.post('/', async (req, res, next) => {
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

// 대댓글 작성
router.post('/reply', async (req, res, next) => {
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

module.exports = router;