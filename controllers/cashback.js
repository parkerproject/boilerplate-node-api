require('dotenv').load();
var _ = require('lodash');
var Joi = require('joi');
var req = require('request');
var urlCommission = 'https://partner-api.groupon.com/reporting/v2/order.json?clientId=' + process.env.GROUPON_KEY + '&group=date&date=[2015-01-01&date=2015-12-31]&campaign.currency=USD';


module.exports = {
    index: {
        handler: function(request, reply) {

            "use strict";

            var user = request.query.user_id; //to be used later

            // req(headerObj, function(error, response, body) {

            //     if (!error && response.statusCode == 200) {
            //         var info = JSON.stringify(body);
            //         reply(body);
            //     }

            // });
            reply({
                'cash': '0.00',
                'user': user
            });

        },

        validate: {
            query: {
                user_id: Joi.string()
            }
        }

    }
};