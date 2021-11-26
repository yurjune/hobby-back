const express = require('express');
const router = express();
const { User } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: 1, },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;