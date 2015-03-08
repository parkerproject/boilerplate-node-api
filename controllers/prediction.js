require('dotenv').load();
var predictionio = require('predictionio-driver');
var accessKey = 'uA6f9dJ8lbpnWsodajuXgciKSv09ODFmMPPRIxxp2RHfsTvTRhy5J5R9gwTLoKZ4';
var client = new predictionio.Events({
    appId: 1,
    accessKey: accessKey
});

client.status()
    .then(function(status) {
        console.log(status); // Prints "{status: 'alive'}"
    });
var Joi = require('joi');



module.exports = {
    createUser: {
        handler: function(request, reply) {

            "use strict";
            // Register a new user

            client.createUser({
                uid: request.payload.UDID
            })
                .then(function(result) {
                    console.log(result); // Prints "{eventId: 'something'}"
                    reply(result);
                })
                .catch(function(err) {
                    console.error(err); // Something went wrong
                    reply(err);
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
                geo: Joi.array()
            }
        }

    },



    createItem: {
        handler: function(request, reply) {
            // Register a new item
            request.payload.eventTime = new Date().toISOString();
            client.createItem(request.payload)
                .then(function(result) {
                    console.log(result); // Prints "{eventId: 'something'}"
                    reply(result);
                }).
            catch(function(err) {
                console.error(err); // Something went wrong
                reply(err);
            });
        }

    },

    createAction: {
        handler: function(request, reply) {
            // Register a new user-to-item action
            client.createAction({
                event: request.payload.event,
                uid: request.payload.UDID,
                deal_id: request.payload.deal_id,
                eventTime: new Date().toISOString()
            }).
            then(function(result) {
                console.log(result); // Prints "{eventId: 'something'}"
                reply(result);
            }).
            catch(function(err) {
                console.error(err); // Something went wrong
                reply(err);
            });
        }
    },

};