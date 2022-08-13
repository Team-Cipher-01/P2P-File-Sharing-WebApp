const Files = require('../../db/models/file.model');

class Service {
  constructor() { }

  async getSearchAll(keyword) {
    try {
      {
        const files = await this.getSearchResultsList(keyword, 0, 10);
        return (files && files.length) ? files : [];
      }
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while getting search results');
    }
  }

  async getSearchResultsList(query, skip = 0, limit = 10) {
    try {
      const result = await Files.aggregate(await this.getAggregateQuery('search', query, skip, limit));

      return result;
    } catch (error) {
      console.error('[GET-SEARCH-RESULTS] Error');
      console.error(error);
      throw error;
    }
  }

  async getAggregateQuery(type, query, skip, limit) {
    try {
      let aggregateQuery = [];
      switch (type) {
        //search aggregation takes user's details into consideration.
        case 'user-search': {
          aggregateQuery = [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: { path: '$user' } },
            {
              $match: {
                $and: [{
                  $or: [
                    { name: { $regex: `${query}`, $options: 'i' } },
                    { type: { $regex: `${query}`, $options: 'i' } },
                    { 'user.name': { $regex: `${query}`, $options: 'i' } },
                  ]
                },
                ]
              },
            },
            {
              $project: {
                name: 1,
                type: 1,
                userId: "$user.userId",
                size: 1,
                createdAt: 1,
                active: 1
              }
            },
            { $skip: skip },
            { $limit: limit },
          ];
          break;
        }
        //search aggregation does not takes user's details into consideration.
        case 'search': {
          aggregateQuery = [
            {
              $match: {
                $and: [{
                  $or: [
                    { name: { $regex: `${query}`, $options: 'i' } },
                    { type: { $regex: `${query}`, $options: 'i' } },
                  ]
                },
                ]
              },
            },
            {
              $project: {
                name: 1,
                type: 1,
                size: 1,
                user: 1,
                socketId: 1,
                createdAt: 1,
                active: 1
              }
            },
            {
              $sort: { createdAt: -1 }
            },
            { $skip: skip },
            { $limit: limit },
          ];
          break;
        }
        default:
          aggregateQuery = {};
          break;
      }
      return aggregateQuery;
    } catch (error) {
      // adding comment for new deployment.
      console.error('[GET-AGG-QUERY] Error');
      console.error(error);
      throw error;
    }
  }
}

module.exports = new Service();
