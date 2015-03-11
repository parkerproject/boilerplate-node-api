require('dotenv').load();
var raccoon = require('raccoon');
raccoon.config.nearestNeighbors = 10; // number of neighbors you want to compare a user against
raccoon.config.className = 'deal'; // prefix for your items (used for redis)
raccoon.config.numOfRecsStore = 30; // number of recommendations to store per user
raccoon.connect(6379, '127.0.0.1');
raccoon.flush() // flushes your redis instance

module.exports = {
    createAction: {
        handler: function(request, reply) {
            var userId = request.payload.UDID;
            var productId = request.payload.deal_id;
            raccoon.liked(userId, productId, function(status) {
                reply('item added to redis=> ' + status);
            });
        }
    },

    recommend: {
        handler: function(request, reply) {
            var userId = request.query.UDID;
            raccoon.recommendFor(userId, 10, function(results) {
                // results will be an array of x ranked recommendations for userID
                reply(results); // for testing
            });
        }
    }
};