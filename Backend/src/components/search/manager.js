'use strict';
const searchService = require('./service');

class Manager {

  static async getSearchData(req, res) {
    try {
      const { keyword, type = 'all' } = req.body;
      let data = {};
      switch (type) {
        case 'all': {
          data = await searchService.getSearchAll(keyword);
          
          break;
        }
        default: {
          throw new Error({ message: 'Invalid Search Tab Option.' });
        }
      }
      res.status(200).send({ success: true, message: 'ok', data });
    } catch (error) {
      console.error(error);
      res.status(200).send({ success: false, error });
    }
  }

}

module.exports = Manager;
