
var express = require('express'),
var cors = require('cors'),
app = express(),
port = process.env.PORT || 3000;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors())

var routes = require('./api/routes/index');
module.exports = app;
routes(app);
app.listen(port);

console.log('App running at http://localhost:' + port +'/');