/* global mongojs */
require('dotenv').load();
var collections = ['list'];
var db = require("mongojs").connect(process.env.CITIES_MONGODB_URL, collections);
var Joi = require('joi');
var _ = require('lodash');




module.exports = {
  index: {
    handler: function(request, reply) {
      db.cities.find({}, function(err, results) {
        reply(results);
      });
    },

    validate: {
      query: {
        limit: Joi.number().integer().min(1).
        default (20),
        offset: Joi.number().min(1).integer(),
        category: Joi.string(),
        city: Joi.string(),
        provider: Joi.string(),
        region: Joi.string(),
        geo: Joi.array()
      }
    }

  }


};