var requireDirectory = require('require-directory');

module.exports = function(server) {

    var controller = requireDirectory(module, './controllers');

    // Array of routes for Hapi
    var routeTable = [{
            method: 'GET',
            path: '/api/deals',
            config: controller.base.all_deals
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
        }, {
            method: 'GET',
            path: '/api/deals/search',
            config: controller.search.search
        }, {
            method: 'GET',
            path: '/api/deals/providers',
            config: controller.base.providers
        }, {
            method: 'GET',
            path: '/api/deals/reviews',
            config: controller.reviews.reviews
        },

        {
            method: 'GET',
            path: '/api/deals/prices',
            config: controller.base.price
        }, {
            method: 'GET',
            path: '/api/deals/trending',
            config: controller.trending.index
        }
    ];
    return routeTable;
};