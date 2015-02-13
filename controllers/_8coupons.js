require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var _ = require('underscore');
var rp = require('request-promise');

var foodDrinksUrl = 'http://api.8coupons.com/v1/getrealtimelocaldeals?key=' + process.env._8COUPONS + '&categoryid=1';

/*
{"categoryID":"1","category":"Restaurants", subcategory: "Diners" subcategoryID: "15"},
{"categoryID":"2", "category":"Entertainment", subcategory: "Comedy Clubs" subcategoryID: "50"},
{"categoryID":"3","category":"Beauty & Spa", subcategory: "Day Spas" subcategoryID: "65"},
{"categoryID":"4","category":"Services", subcategory: "Gyms" subcategoryID: "76"},
{"categoryID":"6","category":"Shopping", subcategory: "Computers & Electronics" subcategoryID: "89"}

RealTime Local Deals limit 1000 deals
http://api.8coupons.com/v1/getrealtimelocaldeals?key=XYZ

Get rest of the deals
http://api.8coupons.com/v1/getrealtimelocaldeals?key=XYZ&page=2
Get the "Entertainment & Shopping" category deals
http://api.8coupons.com/v1/getrealtimelocaldeals?key=XYZ&categoryid=2,6
Get the "Health and Medical" subcategory deals
http://api.8coupons.com/v1/getrealtimelocaldeals?key=XYZ&&subcategoryID=69
 *
 */

function buildData(json) {
    var doc = {};
    doc.loc = {
        "type": "Point",
        "coordinates": [json.lon, json.lat]
    },
    doc.large_image = json.showImageStandardBig,
    doc.small_image,
    doc.deal_id,
    doc.title,
    doc.url,
    doc.old_price,
    doc.new_price,
    doc.expires_at,
    doc.quantity_bought,
    doc.merchant_address,
    doc.savings,
    doc.insert_date,
    doc.merchant_name,
    doc.provider_name,
    doc.category_name,
    doc.phone,
    doc.merchant_locality,
    doc.description
}


module.exports = {

    index: {
        handler: function(request, reply) {

            rp(foodDrinksUrl)
                .then(function(results) {
                    for (var k = 0, len = results.length; k < len; k++) {

                    }
                    reply(JSON.parse(results)[0]);
                })
                .catch(console.error);
        }

    },

};