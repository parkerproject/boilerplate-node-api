var requireDirectory = require('require-directory');

module.exports = function(server) {

    var controller = requireDirectory(module, './controllers');

    // Array of routes for Hapi
    var routeTable = [{
            method: 'GET',
            path: '/deals',
            config: controller.base.all_deals
        },

        {
            method: 'GET',
            path: '/deals/cities',
            config: controller.base.cities
        },

        {
            method: 'GET',
            path: '/deals/categories',
            config: controller.base.categories
        }, {
            method: 'GET',
            path: '/deals/search',
            config: controller.search.search
        }, {
            method: 'GET',
            path: '/deals/providers',
            config: controller.base.providers
        }, {
            method: 'GET',
            path: '/deals/reviews',
            config: controller.reviews.reviews
        },

        {
            method: 'GET',
            path: '/deals/prices',
            config: controller.base.price
        }, {
            method: 'GET',
            path: '/deals/trending',
            config: controller.trending.index
        }
    ];
    return routeTable;
};