require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var _ = require('underscore');
var Promise = require('es6-promise').Promise;



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
        _id: -1
      }).limit(limit, function(err, results) {
        reply(results);
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

  featured: {
    handler: function(request, reply) {

      var providers = ['livingsocials', 'amazon local', 'groupon'];
      var queryObj = {};
      var results = [];
      var count = providers.length;

      if (request.query.city) queryObj.merchant_locality = new RegExp(request.query.city, 'i');
      if (request.query.region) queryObj.merchant_region = new RegExp(request.query.region, 'i');


      providers.forEach(function(provider) {
        queryObj.provider_name = provider;

        providerCall(queryObj, function(deals) {

          (function(d) {
            count -= 1;
            results.push(d);


            if (count === 0) reply(_.shuffle(_.flatten(results, [1])));

          })(deals);

        });

      });




      // send the providers array to the query string, something like &providers=groupon|livingsocials|amazon local
      // use mongodb $in operator to return results in that array
      // finally when the results comes up, shuffle with underscore shuffle function
      // the total number of results should be 45(15 each)


    },

    validate: {
      query: {
        city: Joi.string(),
        region: Joi.string()
      }
    }

  }




};