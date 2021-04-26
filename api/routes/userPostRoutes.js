'use strict';

module.exports = function(app) {
    var x = require('../controllers/userPostController');

    app.route('/post').post(x.create_a_post);
    app.route('/getposts').get(x.list_posts);
};