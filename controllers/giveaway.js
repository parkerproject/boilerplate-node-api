require('dotenv').load();
var collections = ['deals', 'cities', 'categories', 'providers', 'price'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var _ = require('underscore');
var Joi = require('joi');


module.exports = {
    index: {
        handler: function(request, reply) {

            "use strict";

            var user = request.query.UDID;

            var sweeps = {
                "title": "$10 Spa Day Gift Card",
                "image": "https://dl.dropboxusercontent.com/u/9995989/spa.png",
                "points": 500
            };

            reply(sweeps);

        },

        validate: {
            query: {
                UDID: Joi.string()
            }
        }

    }
};