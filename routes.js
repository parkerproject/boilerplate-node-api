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

				{
					method: 'GET',
					path: '/api/deals/featured',
					config: controller.base.featured
				},
				{
					method: 'GET',
					path: '/api/deals/cities',
					config: controller.base.cities
				},
			
				{
					method: 'GET',
					path: '/api/deals/categories',
					config: controller.base.categories
				},
				{
					method: 'GET',
					path: '/api/deals/search',
					config: controller.base.search
				},
				{
					method: 'GET',
					path: '/api/deals/providers',
					config: controller.base.providers
				}
    ];
    return routeTable;
};