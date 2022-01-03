const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const results = await Post.findAll({
      limit,
      offset: limit * (page),
      order: [['createdAt' , 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name'],
        include: [{
          model: Image,
          attributes: ['src'],
        }]
      },{
        model: User,
        as: 'Likers',
        attributes: ['id'],
      },{
        model: Image,
      },{
        model: Comment,
        attributes: ['id'],
      }],
    });
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 특정 유저의 게시글들 불러오기
router.get('/profile', async (req, res, next) => {
  try {
    const results = await Post.findAll({
      where: { UserId: req.query.userId },
      order: [['createdAt' , 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name'],
        include: [{
          model: Image,
          attributes: ['src'],
        }]
      },{
        model: User,
        as: 'Likers',
        attributes: ['id'],
      },{
        model: Image,
        attributes: ['src'],
      },{
        model: Comment,
        attributes: ['id'],
      }],
    });
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
