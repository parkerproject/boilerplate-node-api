var requireDirectory = require('require-directory');

module.exports = function(server) {
	
	var controller = requireDirectory(module, './controllers');
   
    // Array of routes for Hapi
    var routeTable = [
        {
					method: 'GET',
					path: '/api/deals',
					config: controller.base.all_deals
        },

			// 				{
			// 					method: 'GET',
			// 					path: '/api/deals/{city}/{category?}',
			// 					config: controller.base.city
			// 				}
    ];
    return routeTable;
};