var Xray = require('x-ray');
var x = Xray();
var _ = require('lodash');


var url = 'http://www.anrdoezrs.net/click-7742062-10451612?url=http://www.restaurant.com/le-peep-evanston-pid=962?prti=1647';

function clean(n) {
  return n.trim();
}

x(url, {
  merchant: '.details h3',
  large_image: '.mainImage img@src',
  address: '.street',
  meta_property: ['meta@property'],
  meta_content: ['meta@content']
})(function(err, obj) {
//   var address = obj.address.trim();
//   address = address.split('\r\n');
//   address = _.map(address, clean);
//   address = address.toString();
//   address = address.replace(/,/g, ' ');

  var latIndex = obj.meta_property.indexOf('place:location:latitude');
  var lngIndex = obj.meta_property.indexOf('place:location:longitude');
	var phoneIndex = obj.meta_property.indexOf('restaurant:contact_info:phone_number');
	var streetIndex = obj.meta_property.indexOf('restaurant:contact_info:street_address');
	var localityIndex = obj.meta_property.indexOf('restaurant:contact_info:locality');
	var regionIndex = obj.meta_property.indexOf('restaurant:contact_info:region');
	var postalcodeIndex = obj.meta_property.indexOf('restaurant:contact_info:postal_code');

	
	
// 	     'restaurant:contact_info:street_address',                                  
//      'restaurant:contact_info:locality',                                        
//      'restaurant:contact_info:region',                                          
//      'restaurant:contact_info:postal_code',                                     
//      'restaurant:contact_info:country_name',                                    
//      'restaurant:contact_info:phone_number',

  obj.merchant_name = obj.merchant.trim();
  obj.category_name = "Food & Drinks";
  obj.address = obj.meta_content[streetIndex]+ ' '+obj.meta_content[localityIndex]+ ' '+ obj.meta_content[regionIndex]+' '+obj.meta_content[postalcodeIndex];
	obj.phone = obj.meta_content[phoneIndex];
  obj.loc = {
    type: "Point",
    coordinates: [obj.meta_content[lngIndex],obj.meta_content[latIndex]]
  };
	obj.zip_code = obj.meta_content[postalcodeIndex];
	obj.merchant_locality = obj.meta_content[localityIndex];
  obj.meta_content = null;
  obj.meta_property = null;




  console.log(obj);

});