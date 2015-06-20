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

function deal(item) {
  return {
    "loc": item.loc,
    "category_name": "Food & Drinks",
    "large_image": item.large_image,
    "deal_id": item.deal_id,
    "title": item.price+" Certificate",
    "url": "http://www.anrdoezrs.net/click-7742062-10451612?url=https://www.restaurant.com/taqueria-mi-oficina-houston-pid=215258",
    "small_image": "https://rdc.rdcimage.com:443/partner-images/215258/listingsimage_photo4.jpg",
    "old_price": item.price,
    "new_price": item.retailprice,
    "expires_at": "",
    "quantity_bought": 0,
    "merchant_address": item.address,
    "savings": 60,
    "insert_date": "2015-06-06 18:40:14.322011",
    "merchant_name": "Taqueria Mi Oficina",
    "provider_name": "Restaurant.com",
    "zip_code": "77007",
    "phone": "(832)814-0311",
    "merchant_locality": "Houston",
    "description": ""
  };
}


var q = async.queue(function(doc, callback) {
  // code for your update

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