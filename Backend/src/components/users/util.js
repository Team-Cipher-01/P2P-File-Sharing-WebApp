const config = require("../../config/auth.config");
var jwt = require("jsonwebtoken");

const createJwtToken = (userId) => {
  console.log("Create Token for: ", userId);

  const token = jwt.sign({ id: userId }, config.secret, {
    expiresIn: 86400 // 24 hours
  });

  return token;

};

const Util = {
  createJwtToken,
};

module.exports = Util;