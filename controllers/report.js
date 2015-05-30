/* global mongojs */
require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');


module.exports = {
    count_deals: {
        handler: function(request, reply) {

            "use strict";
            var findObj = {};


            if (request.query.city) {
                var city = decodeURIComponent(request.query.city);
                findObj.merchant_locality = new RegExp(city, 'i');
            }

            if (request.query.provider) {
                var provider = decodeURIComponent(request.query.provider);
                findObj.provider_name = new RegExp(provider, 'i');
            }

            console.log(findObj);


            db.deals.count(findObj, function(error, number) {
                console.log(number);
                reply(provider + ' has got ' + number + ' deals in ' + city);
            });

        },

        validate: {
            query: {
                city: Joi.string(),
                provider: Joi.string()
            }
        }

    }
};