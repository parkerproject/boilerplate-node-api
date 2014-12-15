require('dotenv').load();
var Joi = require('joi');
var google = require('google');

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



function hashFn(item, arr) {
  return arr[item];
}


module.exports = {

  reviews: {
    handler: function(request, reply) {
			
      var business_address = '';
      var business_name = decodeURIComponent(request.query.business);
			if(request.query.address)business_address = ' ' + decodeURIComponent(request.query.address);
			//if(request.query.location) business_address = ' ' + decodeURIComponent(request.query.location);

      google.resultsPerPage = 10;
      var nextCounter = 0;
      var patternUrl = new RegExp("www.yelp.com/biz/", 'i');
      var patternTitle = new RegExp(business_name, 'i');
			
			//console.log('yelp ' + business_name + business_address);

      google('yelp ' + business_name + business_address, function(err, next, links) {
				
				//console.log(links);

        if (err) console.error(err);

        for (var i = 0; i < links.length; ++i) {

          var business_url = links[i].link;
          var business_title = links[i].title;
					

          if (patternUrl.test(business_url)) {

            var arr = business_url.split('/');
            var business_id = arr[(arr.length) - 1];
						

            searchYelp(business_id, function(biz) {
							
                reply(biz);

            });


            break;

          }else{
						reply({'rating': null});
					}

        }

      });


    },

    validate: {
      query: {
        business: Joi.string(),
        //location: Joi.string(),
        phone: Joi.string(),
				address: Joi.string()
      }
    }

  }


};