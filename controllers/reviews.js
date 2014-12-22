require('dotenv').load();
var Joi = require('joi');
var _ = require('underscore');
var yelp = require("yelp").createClient({
    consumer_key: "9EH0m_d2u_xDFwbXzBSd7Q",
    consumer_secret: "YZlPfA23FaaYKwat1muiwIVFrts",
    token: "zySwZm2QhzHApHRimJX8dcT4ycC6Y_WB",
    token_secret: "3jNfZx7fGZ4cw43ne2ySvRb2g_Q"
});

function searchYelp(params, cb) {

    yelp.search(params, function(error, data) {
        if (error) console.log(error);
        if (data) cb(data);
    });

}

function businessYelp(id, cb) {

    yelp.business(id, function(error, data) {
        if (error) console.log(error);
        if (data) cb(data);
    });

}



function hashFn(item, arr) {
    return arr[item];
}


module.exports = {

    reviews: {
        handler: function(request, reply) {

            var terms = {};

            if (request.query.business) {
                var term = decodeURIComponent(request.query.business);
                terms.term = term.split(' ').join('+');
            }

            if (request.query.location) {
                var location = decodeURIComponent(request.query.location);
                terms.location = location.split(' ').join('+');
            }

            searchYelp(terms, function(biz) {

                if (typeof biz.businesses !== 'undefined' && biz.businesses.length > 0) {

                    var business;

                    if (request.query.phone) {

                        var phone = (request.query.phone).split('-').join('');

                        business = _.findWhere(biz.businesses, {
                            phone: phone
                        });

                        if (typeof business !== 'undefined') {
                            businessYelp(business.id, function(res) {
                                console.log('hip3');
                                reply(res);
                            });

                        } else {
                            reply({
                                'rating': null
                            });
                        }

                    } else {
                        business = biz.businesses[0];
                        businessYelp(business.id, function(res) {
                            reply(res);
                        });
                    }

                } else {
                    reply({
                        'rating': null
                    });
                }

            });
        },

        validate: {
            query: {
                business: Joi.string(),
                location: Joi.string(),
                phone: Joi.string()
            }
        }

    }


};