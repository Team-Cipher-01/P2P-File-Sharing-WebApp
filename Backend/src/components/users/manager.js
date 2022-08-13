'use strict';
const userServiceObj = require('./service');
const Util = require('./util');

class Manager {

  static async createUser(req, res) {
    try {
      console.info("Create User: ", req.body);
      const { userId, password } = req.body;
      const userExists = await Manager.checkUserExist(userId);
      let user;
      if(!userExists) {
        user = await userServiceObj.createUser(userId, password);
      } else {
        throw new Error("UserId is already in use.");
      }
      res.status(200).send({ message: 'ok', status: 'User Created.', user, success: true });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ message: 'ok', status: 'User Not Created.', success: false });
    }
  }

  static async userLogin(req, res) {
    try {
      console.info("User Login Request: ", req.body.userId);
      const { userId, password } = req.body;
      const userExists = await Manager.checkUserExist(userId);
      let userToken;
      if(userExists) {
        const isValidUser = await userServiceObj.checkValidLogin(userId, password);
        if (isValidUser)
          userToken = Util.createJwtToken(req.body.userId);
        else
          throw new Error("Invalid Login.");
      }
      res.status(200).send({ message: 'ok', status: 'User Login Success.', userToken, success: true });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ message: 'ok', status: 'User Login Failed.', success: false });
    }
  }

  static async checkUserExist(userId) {
    try {
      let user = await userServiceObj.getUserById(userId);

      console.info("Check if user exists called");

      if (user) {
        return true;
      } else {  
        return false;
      }

    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async getUserByEmail(userId) {
    try {
      let user = await userServiceObj.getUserByUsername(userId);

      console.info("Check if user fetch called");

      return user._id;

    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
}

module.exports = Manager;
