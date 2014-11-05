require('dotenv').load();
var collections = ['deals', 'cities', 'categories', 'providers'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var _ = require('underscore');
var loading = 'Fetching deals...';

var bulk = db.deals.initializeOrderedBulkOp();



// bulk.find({provider_name: "amazon local"}).update({$set: {provider_name: "Amazon Local"}});

// bulk.execute(function(err, res) {
//   console.log(res);
// });



function providerCall(queryObj, fn) {
  db.deals.find(queryObj).sort({
    _id: -1
  }).limit(15, function(err, results) {
    fn(results);
  });
}




module.exports = {
  all_deals: {
    handler: function(request, reply) {

      "use strict";

      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;
      var findObj = {};



      if (request.query.category) findObj.category_name = new RegExp(request.query.category, 'i');
      if (request.query.city) findObj.merchant_locality = new RegExp(request.query.city, 'i');
      if (request.query.provider) findObj.provider_name = new RegExp(request.query.provider, 'i');
      if (request.query.region) findObj.merchant_region = new RegExp(request.query.region, 'i');

      db.deals.find(findObj).skip(skip).sort({
        insert_date: -1
      }).limit(limit, function(err, results) {
        if (results.length === 0) reply(loading);

        if (results.length !== 0) {
          var cachedResults = _.shuffle(results);
					reply(cachedResults);
        }
        


      });
    },

    validate: {
      query: {
        limit: Joi.number().integer().min(1).max(50).
        default (20),
        offset: Joi.number().min(1).max(100).integer(),
        category: Joi.string(),
        city: Joi.string(),
        provider: Joi.string(),
        region: Joi.string()
      }
    }

  },



  cities: {
    handler: function(request, reply) {
      db.cities.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  categories: {
    handler: function(request, reply) {
      db.categories.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  providers: {
    handler: function(request, reply) {
      db.providers.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  search: {
    handler: function(request, reply) {

      var q = request.query.q;
      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;

      q = q.trim();
      db.deals.find({
        $text: {
          $search: q
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }).sort({
        score: {
          $meta: "textScore"
        }
      }).limit(limit, function(err, results) {
        reply(results);
      });


    },

    validate: {
      query: {
        q: Joi.string(),
        limit: Joi.number().integer().min(1).max(50).
        default (20),
        offset: Joi.number().min(1).max(100).integer()
      }
    }

  },




};