'use strict';

const express = require('express');
const app = express();
const path = require('path');
const port = process.env['chatcatPort'] || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config/config.js');
const ConnectMongo = require('connect-mongo')(session);
const mongoose = require('mongoose').connect(config.dbUrl);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

let env = process.env.NODE_ENV || 'development';
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

require('./routes/routes.js')(express,app, passport);

app.listen(port, function(){
	console.log("Chatcat is loading...");
	console.log("\thttp://localhost:",port);
	console.log("\tApp Runtime Mode: ", env);
});
