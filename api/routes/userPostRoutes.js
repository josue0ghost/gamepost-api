'use strict';

module.exports = function(app) {
    var x = require('../controllers/userPostController');

    app.route('/post').post(x.create_a_post);
    app.route('/getposts').post(x.list_posts);
};