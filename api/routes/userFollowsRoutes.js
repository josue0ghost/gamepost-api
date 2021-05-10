'use strict';

module.exports = function(app) {
    var x = require('../controllers/userFollowsController');
    
    app.route('/search').post(x.search_users);
    app.route('/follow').post(x.follow_user);
};