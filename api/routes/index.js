'use strict';

module.exports = function(app) {
    var posts = require('./userPostRoutes');
    var follows = require('./userFollowsRoutes');

    posts(app);
    follows(app);
}