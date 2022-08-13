const router = require('express').Router();
const { Manager } = require('../../components').User;
const Auth = require('../../middlewares/auth');

router.post(
  '/register',
  Auth.validateJsonContent,
  Auth.validateRegistrationCredentials,
  Manager.createUser
);

router.post(
  '/login',
  Auth.validateJsonContent,
  Manager.userLogin
);

module.exports = router;
