require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');


module.exports = {
  all_deals: {
    handler: function(request, reply) {
      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;
			var findObj = {};
					
			if(request.query.category) findObj.category_name = request.query.category;
			if(request.query.city) findObj.merchant_locality = request.query.city;
	
			
      db.deals.find(findObj).skip(skip).sort({
        _id: -1
      }).limit(limit, function(err, results) {
        reply(results);
      });
    },

    validate: {
      query: {
        limit: Joi.number().integer().min(1).max(50).default (20),
				offset: Joi.number().min(1).max(100).integer(),
				category: Joi.string(),
				city: Joi.string()
      }
    }

  }

};