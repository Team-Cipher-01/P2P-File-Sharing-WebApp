
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
  
class Auth {

  static async socketAuthorize(socket, headers) {
    try {
      console.log(headers);
      // socket.userData = { userId: '61df085847a073253fb0ef54', type: 1 };
      socket.userData = { userId: '61f03bf0f52fcb7977552587', type: 1 };
      return;

      // socket.userData = resp.data.data;
      // return;
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  static async userAuthorize(req, res, next) {
    try {
      console.log(req.body);
      req.body = { userId: '61f03bf0f52fcb7977552587'};
      next();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      let token = req.headers["x-access-token"];
      if (!token) {
        return res.status(403).send({
          message: "No token provided!"
        });
      }
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        req.userId = decoded.id;
        next();
      });
    } catch(error) {
      console.error(error.message);
    }
  };

  static async validateJsonContent(req, res, next) {
    try {
      if (
        req.headers['content-type'] &&
        !req.headers['content-type'].startsWith('application/json')
      ) {
        throw new Error("Invalid content format.");
      }
      next();
    } catch (error) {
      console.error(error.message);
    }
  }

  static async validateRegistrationCredentials(req, res, next) {
    try {
      if (
        !(req.body.userId && req.body.password)
      ) {
        throw new Error("Registration Credentials missing.");
      }
      next();
    } catch (error) {
      console.error(error.message);
    }
  }
  

}

module.exports = Auth;
