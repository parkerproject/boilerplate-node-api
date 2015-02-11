require('dotenv').load();
var collections = ['deals', 'cities', 'categories', 'providers', 'price'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var _ = require('underscore');
var loading = 'Fetching deals...';
var google = require('google');



String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};



function searchYelp(name, cb) {

    var yelp = require("yelp").createClient({
        consumer_key: "9EH0m_d2u_xDFwbXzBSd7Q",
        consumer_secret: "YZlPfA23FaaYKwat1muiwIVFrts",
        token: "zySwZm2QhzHApHRimJX8dcT4ycC6Y_WB",
        token_secret: "3jNfZx7fGZ4cw43ne2ySvRb2g_Q"
    });

    yelp.business(name, function(error, data) {
        if (error) console.log(error);
        if (data) cb(data);
    });

}



var categoryArray = {
    'food, drinks': ['Restaurants, Bars & Pubs', 'Food & Drinks', 'Restaurants'],
    'activities, events, travel': ['Entertainment & Travel', 'Things to do', 'Events & Activities'],
    'beauty, health': ['Health & Beauty', 'Health & Fitness', 'Beauty & Spas', 'Sports & Fitness'],
    'shopping, services': ['Home Services', 'Local Services', 'Services', 'Shopping & Services', 'Shopping']
};

var priceArray = {
    'less than $25': {
        $lt: 25
    },
    'less than $50': {
        $lt: 50
    },
    'less than $75': {
        $lt: 75
    },
    'over $75': {
        $gt: 75
    }
};

function hashFn(item, arr) {
    return arr[item];
}


module.exports = {
    index: {
        handler: function(request, reply) {

            "use strict";

            var limit = request.query.limit || 20;
            var skip = request.query.offset || 0;
            var findObj = {};

            if (request.query.city) findObj.merchant_locality = new RegExp(request.query.city, 'i');

            findObj.quantity_bought = {
                $ne: ''
            };

            console.log(findObj);

            db.deals.find(findObj).skip(skip).sort({
                quantity_bought: -1
            }).limit(limit, function(err, results) {
                reply(results);
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