'use strict';
class Search {

  /*static validateAutocompleteQuery(req, res, next) {
    try {
      const { keyword } = req.query;

      // For string variables
      if (typeof (keyword) === 'string' && keyword.trim().length > 3)
        next();
      else
        throw new UnprocessableEntityException(INSUFFICIENT_SEARCH_QUERY); 

    } catch (error) {
      next(error);
    }
  }
  static async validateSearchQuery(req, res, next) {
    try {
      const { keyword, type, page } = req.query;
      const { userId } = req.userData;

      if (!userId || !isValidObjectId(userId)) {
        throw new BadRequestException({
          ...VALIDATION_ERROR,
          message: 'userId is invalid or missing!!',
        });
      }

      // For keyword variables
      if (!(typeof (keyword) === 'string' && keyword.trim().length > 0))
        throw new UnprocessableEntityException(INSUFFICIENT_SEARCH_QUERY);

      // For type variables
      if (type) {
        const valid = await Search.isValidSearchType(type);
        if (!(typeof (type) === 'string' && valid))
          throw new UnprocessableEntityException(INVALID_PAYLOAD);
      }
      // For page variables
      if (page) {
        if (!(typeof (page) === 'string'))
          throw new UnprocessableEntityException(INVALID_PAYLOAD);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
  static validateSearchFeedRequest(req, res, next) {
    try {
      const userId = req.userData.userId;

      if (!userId || !isValidObjectId(userId)) {
        throw new BadRequestException({
          ...VALIDATION_ERROR,
          message: 'userId is invalid or missing!!',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static async isValidSearchType(type) {
    return Object.values(SEARCH.searchTypes).includes(type);
  }*/
}

module.exports = Search;
