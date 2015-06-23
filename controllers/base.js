/* global mongojs */
require('dotenv').load();
var collections = ['cj', 'test'];
var db = require("mongojs").connect(process.env.DEV_MONGODB_URL, collections);
var _ = require('lodash');
var async = require('async');



// db.cj.count({
//   PROGRAMNAME: "Restaurant.com"
// }, function(err, num) {
//   console.log(num);
// });
//     obj.loc = {
//     type: "Point",
//     coordinates: [obj.meta_content[lngIndex], obj.meta_content[latIndex]]
// };

function deal(item) {
    return {
        "loc": item.loc,
        "category_name": "Food & Drinks",
        "large_image": item.large_image,
        "deal_id": item.deal_id,
        "title": item.price + " Certificate",
        "url": item.BUYURL,
        "small_image": item.small_image,
        "old_price": item.price,
        "new_price": item.retailprice,
        "expires_at": "",
        "quantity_bought": 0,
        "merchant_address": item.address,
        "savings": item.savings,
        "insert_date": "",
        "merchant_name": item.merchant_name,
        "provider_name": "Restaurant.com",
        "zip_code": item.zip_code,
        "phone": item.phone,
        "merchant_locality": item.merchant_locality,
        "description": item.description,
        "keywords": item.keywords,
        "coupon": "no"
    };
}


var q = async.queue(function(doc, callback) {
    // code for your update
    // 1. make a scrape to scraper.js
    // 2. returns an object
    // 3. save the object (upsert) to mongodb

    db.test.save({
        url: doc.BUYURL
    });

}, Infinity);

var cursor = db.cj.find({
    PROGRAMNAME: "Restaurant.com"
});
cursor.forEach(function(err, doc) {
    if (err) throw err;
    if (doc) q.push(doc); // dispatching doc to async.queue
});

q.drain = function() {
    if (cursor.isClosed()) {
        console.log('all items have been processed');
        db.close();
    }
};