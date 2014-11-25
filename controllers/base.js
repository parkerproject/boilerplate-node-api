require('dotenv').load();
var collections = ['deals', 'cities', 'categories', 'providers'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var _ = require('underscore');
var loading = 'Fetching deals...';

// var bulk = db.deals.initializeOrderedBulkOp();

// bulk.find({provider_name: "Amazon Local", merchant_locality: "albany"}).update({$set: {merchant_locality: "boston"}});                                                         

// bulk.execute(function(err, res) {                                                                                                                   
//  console.log(res);                                                                                                                                 
// });


String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex;
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};


var find = [
'restaraunt',
'cafe',
'kitchen & Bar',
'bar',
'grill',
'company',
'lounge',
'restaraunt & lounge'
 ];

var replace = ['', '', '', '', '', '', '', ''];


function searchYelp(name, location, cb) {

  var yelp = require("yelp").createClient({
    consumer_key: "9EH0m_d2u_xDFwbXzBSd7Q",
    consumer_secret: "YZlPfA23FaaYKwat1muiwIVFrts",
    token: "zySwZm2QhzHApHRimJX8dcT4ycC6Y_WB",
    token_secret: "3jNfZx7fGZ4cw43ne2ySvRb2g_Q"
  });

  yelp.search({
    term: name,
    location: location
  }, function(error, data) {
    if (error) console.log(error);
    if (data) cb(data);
  });

}




function providerCall(queryObj, fn) {
  db.deals.find(queryObj).sort({
    _id: -1
  }).limit(15, function(err, results) {
    fn(results);
  });
}

var categoryMap = {
  'food, drinks': ['Restaurants, Bars & Pubs', 'Food & Drinks', 'Restaurants'],
  'activities, events, travel': ['Entertainment & Travel', 'Things to do', 'Events & Activities'],
  'beauty, health': ['Health & Beauty', 'Health & Fitness', 'Beauty & Spas', 'Sports & Fitness'],
  'shopping, services': ['Home Services', 'Local Services', 'Services', 'Shopping & Services', 'Shopping']
};

function categoryArray(item) {
  return categoryMap[item];
}


module.exports = {
  all_deals: {
    handler: function(request, reply) {

      "use strict";

      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;
      var findObj = {};



      if (request.query.category && request.query.category !== 'all deals') {

        var cArray = categoryArray(request.query.category);

        findObj.$or = cArray.map(function(item) {
          return {
            category_name: new RegExp(item, "i")
          };
        });

      } else {
        // still thinking of what to put here:)
      }


      if (request.query.city) findObj.merchant_locality = new RegExp(request.query.city, 'i');
      if (request.query.provider) findObj.provider_name = new RegExp(request.query.provider, 'i');
      if (request.query.region) findObj.merchant_region = new RegExp(request.query.region, 'i');


      db.deals.find(findObj).skip(skip).sort({
        insert_date: -1
      }).limit(limit, function(err, results) {
        if (results.length === 0) reply(loading);

        if (results.length !== 0) {
          var cachedResults = _.shuffle(results);
          reply(cachedResults);
        }



      });
    },

    validate: {
      query: {
        limit: Joi.number().integer().min(1).max(50).
        default (20),
        offset: Joi.number().min(1).max(100).integer(),
        category: Joi.string(),
        city: Joi.string(),
        provider: Joi.string(),
        region: Joi.string()
      }
    }

  },



  cities: {
    handler: function(request, reply) {
      db.cities.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  categories: {
    handler: function(request, reply) {
      db.categories.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  providers: {
    handler: function(request, reply) {
      db.providers.find({}, function(err, results) {
        reply(results);
      });
    }

  },

  reviews: {
    handler: function(request, reply) {

      var business_name = request.query.business;
      var location = request.query.location;
      business_name = business_name.replaceArray(find, replace);



      searchYelp(business_name, location, function(biz) {

        if (biz.businesses.length > 0) {
          var filteredBiz = biz.businesses[0];
          delete filteredBiz.is_claimed;
          delete filteredBiz.mobile_url;
          delete filteredBiz.url;
          delete filteredBiz.snippet_text;
          delete filteredBiz.categories;
          delete filteredBiz.image_url;
          delete filteredBiz.snippet_image_url;

          reply(filteredBiz);
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

  },

  search: {
    handler: function(request, reply) {

      var q = request.query.q;
      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;

      q = q.trim();
      db.deals.find({
        $text: {
          $search: q
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }).sort({
        score: {
          $meta: "textScore"
        }
      }).limit(limit, function(err, results) {
        reply(results);
      });


    },

    validate: {
      query: {
        q: Joi.string(),
        limit: Joi.number().integer().min(1).max(50).
        default (20),
        offset: Joi.number().min(1).max(100).integer()
      }
    }

  },

  similar: {
    handler: function(request, reply) {

      var title = request.query.title;
      var category = request.query.category;
      var limit = 6;

      category = category.replace("&", "");
      category = new RegExp(category, "i");


      title = title.trim();
      db.deals.find({
        category_name: category,
        $text: {
          $search: title
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }).sort({
        score: {
          $meta: "textScore"
        }
      }).limit(limit, function(err, results) {

        var filteredSimilar = _.reject(results, {
          title: title
        });
        reply(filteredSimilar);
      });


    },

    validate: {
      query: {
        title: Joi.string(),
        category: Joi.string()
      }
    }

  }


};