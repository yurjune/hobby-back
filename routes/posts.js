const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment, Hashtag } = require('../models');
const router = express.Router();

// ssr
router.get('/pre', async (req, res, next) => {
  try {
    const results = await Post.findAll({
      limit: 8,
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

// 메인페이지 게시글 가져오기
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const results = await Post.findAll({
      limit,
      offset: limit * (page + 2),
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

// 상세게시글 가져오기
router.get('/detail', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const lastId = parseInt(req.query.lastId, 10);
    const where = {};
    if (lastId) {
      where.id = { [Op.lte]: lastId }
    }

    const posts = await Post.findAll({
      where,
      limit,
      offset: limit * (page),
      order: [['createdAt' , 'DESC']],
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
        }, {
          model: Image, // 프로필 사진
          attributes: ['src'],
        }],
      },{
        model: User,
        as: 'Likers',
        attributes: ['id', 'name'],
      },{
        model: Image,
        attributes: ['src'],
      },{
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'name'],
          include: [{
            model: Image,
            attributes: ['src'],
          }]
        },{
          model: Comment,
          as: 'Father',
        },{
          model: Comment,
          as: 'Son',
          include: [{
            model: User,
            attributes: ['id', 'name'],
            include: [{
              model: Image,
              attributes: ['src'],
            }]
          }]
        }],
      }],
    });
    if (!posts) {
      return res.status(403).send('게시글이 존재하지 않습니다!');
    }
    return res.json(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 특정 유저의 게시글들 불러오기
router.get('/profile', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const userId = parseInt(req.query.userId, 10);
    const where = {};
    if (userId) {
      where.Userid = userId;
    }

    const results = await Post.findAll({
      where,
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

// 해시태그 게시글들 불러오기
router.get('/hashtag', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const tag = decodeURIComponent(req.query.tag);

    const results = await Post.findAll({
      limit,
      offset: limit * (page),
      order: [['createdAt' , 'DESC']],
      include: [{
        model: Hashtag,
        where: { name: tag }, // include 안에 where 가능
      },{
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
