const express = require('express');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth('manageUsers'), (req, res) => {
  res.success([], 2000, 'Hello World!');
});

module.exports = router;
