var Joi = require('joi');
var Bitly = require('bitly');
var bitly = new Bitly('dealsbox', 'R_831e12efa3bd40999ad7427be74b2b51');



module.exports = {
    index: {
        handler: function(request, reply) {
            "use strict";
            var long_url = encodeURIComponent(request.query.url);
            bitly.shorten(request.query.url, function(err, response) {
                if (err) throw err;
                var short_url = response.data.url
                reply(short_url);
            });
        },

        validate: {
            query: {
                url: Joi.string()
            }
        }

    }

};