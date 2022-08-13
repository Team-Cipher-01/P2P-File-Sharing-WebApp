const express = require('express');
const router = express.Router();

router.use('/health-check', (req, res, next) => {
  req.successCode = 'OK';
  req.message = 'Health Check';
  next();
});

router.use('/users',require('./users'));
router.use('/search', require('./search'));

// router.use('/public', require('./public'));

module.exports = router;
