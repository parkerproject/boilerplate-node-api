require('dotenv').load();
var collections = ['deals', 'cities', 'categories', 'providers', 'price'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var Joi = require('joi');
var loading = 'Fetching deals...';


String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex;
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};




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

  search: {
    handler: function(request, reply) {

      var q = '"' + request.query.q + '" ' + request.query.q || '';
      var limit = request.query.limit || 20;
      var skip = request.query.offset || 0;
      var queryObj = {};
      q = q.trim();

      console.log(q);

      if (request.query.city) queryObj.merchant_locality = new RegExp(request.query.city, "i");

      if (request.query.price && request.query.price !== 'All') queryObj.new_price = hashFn(request.query.price, priceArray);

      queryObj.$text = {
        $search: q
      };


      db.deals.find(queryObj, {
        score: {
          $meta: "textScore"
        }
      }).skip(skip).sort({
        //insert_date: -1,
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
        offset: Joi.number().min(1).max(100).integer(),
        city: Joi.string(),
        price: Joi.string(),
        geo: Joi.array()
      }
    }

  }

};