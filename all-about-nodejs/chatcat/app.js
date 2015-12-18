'use strict';

const express = require('express');
const app = express();
const path = require('path');
const port = process.env['CCPORT'] || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config/config.js');
const ConnectMongo = require('connect-mongo')(session);
const mongoose = require('mongoose').connect(config.dbUrl);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

var rooms = [];

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';
if('development' === env) {
	// dev specific settings
	app.use(session({'secret': config.sessionSecret, 'saveUninitialized': true, 'resave': true}));

} else {
	// production specific settings
	app.use(session({'secret': config.sessionSecret,
		'saveUninitialized': true,
		'resave': true,
		'store': new ConnectMongo({
			//'url': config.dbUrl,
			mongooseConnection: mongoose.connections[0],
			'stringify': true
			})
		}));
}

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes.js')(express, app, passport, config, rooms);

// app.listen(port, function(){
// 	console.log("Chatcat on port: " + port);
//  console.log("Runtime mode: "+ env);
// });

app.set('port', port);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(port, function() {
	console.log("Chatcat on port: " + port +" (Runtime mode: "+env+ ")");
});
