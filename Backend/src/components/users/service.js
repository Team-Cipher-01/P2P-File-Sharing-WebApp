const UserModel = require('../../db/models/user.model');
const bcrypt = require("bcryptjs");
class Service {
  /**
     * @param {Object} params
     * @returns User's data in object
     */

  constructor() { }


  async createUser(userId, password) {
    try {
      const userData = {
        userId: userId,
        active: true,
        password: bcrypt.hashSync(password.toString(), 8)
      };
      const user = await UserModel.create(userData);
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async checkValidLogin(userId, password) {
    try {
      const userData = { userName: userId, active: true };
      const user = await UserModel.findOne(userData, {});
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const userData = { userId, active: true };
      let user = await UserModel.findOne(userData, {}).lean();

      if (user)
        return new Error("User already exists. Please login.");
      else
        return user;
    } catch (error) {
      throw error;
    }
  }
  async getUserByUsername(userId) {
    try {
      const userData = { userId, active: true };
      let user = await UserModel.findOne(userData, {}).lean();

      if (!user)
        return new Error("User not found.");
      else
        return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Service();
