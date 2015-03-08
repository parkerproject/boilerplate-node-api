require('dotenv').load();
var predictionio = require('predictionio-driver');
var engine = new predictionio.Engine({
    url: 'http://localhost:8000'
});

// client.status()
//     .then(function(status) {
//         console.log(status); // Prints "{status: 'alive'}"
//     });
var Joi = require('joi');



module.exports = {
    index: {
        handler: function(request, reply) {

            "use strict";
            // Register a new user
            engine.sendQuery({
                uid: request.query.UDID,
                n: 1
            })
                .then(function(result) {
                    console.log(result);
                    reply(result);
                })
                .catch(function(err) {
                    console.error(err); // Something went wrong
                    reply('badass ' + err);
                });

        },

        validate: {
            query: {
                limit: Joi.number().integer().min(1).default(20),
                offset: Joi.number().min(1).integer(),
                category: Joi.string(),
                city: Joi.string(),
                provider: Joi.string(),
                region: Joi.string(),
                geo: Joi.array(),
                UDID: Joi.number()
            }
        }

    },

};