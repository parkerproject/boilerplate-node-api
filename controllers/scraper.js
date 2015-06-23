var Xray = require('x-ray');
var x = Xray();
var _ = require('lodash');



var url = 'http://www.restaurant.com/microsite/60647?prti=1647';
var urlObj = url.split('?url=');
var parsedUrl = _.last(urlObj);
parsedUrl = decodeURIComponent(parsedUrl);
console.log(parsedUrl);


function clean(n) {
    return n.trim();
}


x(parsedUrl, {
    merchant: '.details h3',
    large_image: '.mainImage img@src',
    address: '.street',
    meta_property: ['meta@property'],
    meta_content: ['meta@content']
})(function(err, obj) {


    // var latIndex = obj.meta_property.indexOf('place:location:latitude');
    // var lngIndex = obj.meta_property.indexOf('place:location:longitude');
    var phoneIndex = obj.meta_property.indexOf('restaurant:contact_info:phone_number');
    var streetIndex = obj.meta_property.indexOf('restaurant:contact_info:street_address');
    var localityIndex = obj.meta_property.indexOf('restaurant:contact_info:locality');
    var regionIndex = obj.meta_property.indexOf('restaurant:contact_info:region');
    var postalcodeIndex = obj.meta_property.indexOf('restaurant:contact_info:postal_code');


    obj.merchant_name = obj.merchant.trim();
    obj.category_name = "Food & Drinks";
    obj.address = obj.meta_content[streetIndex] + ' ' + obj.meta_content[localityIndex] + ' ' + obj.meta_content[regionIndex] + ' ' + obj.meta_content[postalcodeIndex];
    obj.phone = obj.meta_content[phoneIndex];
    obj.zip_code = obj.meta_content[postalcodeIndex];
    obj.merchant_locality = obj.meta_content[localityIndex];
    delete obj.meta_content
    delete obj.meta_property


    console.log(obj);

});