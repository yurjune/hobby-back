const express = require('express');
const { Op } = require('sequelize');
const { Post, Image } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const results = await Post.findAll({
      order: [['createdAt' , 'DESC']],
    });
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
