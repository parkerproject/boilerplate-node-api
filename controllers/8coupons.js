require('dotenv').load();
var collections = ['deals'];
var db = require("mongojs").connect(process.env.BOXEDSALE_MONGODB_URL, collections);
var _ = require('underscore');

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