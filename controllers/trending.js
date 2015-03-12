require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var raccoon = require('raccoon');
raccoon.config.nearestNeighbors = 10; // number of neighbors you want to compare a user against
raccoon.config.className = 'deal'; // prefix for your items (used for redis)
raccoon.config.numOfRecsStore = 30; // number of recommendations to store per user
raccoon.connect(process.env.REDIS_PORT, process.env.REDIS_URL, process.env.REDIS_AUTH);


module.exports = {
    index: {
        handler: function(request, reply) {

            "use strict";

            var limit = request.query.limit || 20;

            var findObj = {};

            if (request.query.city) findObj.merchant_locality = new RegExp(request.query.city, 'i');


            raccoon.bestRated(function(results) {
               
                findObj.deal_id = {
                    $in: results
                };
                db.deals.find(findObj).limit(limit, function(err, deals) {
                    reply(deals);
                });

            });
        },

        validate: {
            query: {
                limit: Joi.number().integer().min(1).max(50).
                default(20),
                offset: Joi.number().min(1).max(100).integer(),
                city: Joi.string()
            }
        }

    }
};