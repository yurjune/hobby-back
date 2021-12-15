const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const results = await Post.findAll({
      order: [['createdAt' , 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name'],
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

module.exports = router;
