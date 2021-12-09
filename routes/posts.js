const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const results = await Post.findAll({
      order: [['createdAt' , 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name'],
      },{
        model: Image,
      }],
    });
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
