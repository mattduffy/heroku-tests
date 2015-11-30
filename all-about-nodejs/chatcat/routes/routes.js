'use strict';

module.exports = (express, app, passport, config)=>{
	let router = express.Router();
	router.get('/', (req,res,next)=>{
		res.render('index', {'title': "Welcome to ChitChat Cat Chat."});
	});
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/chatrooms',
		failureRedirect: '/'
		})
	);

	function securePages(req, res, next) {
		if (req.isAuthenticated()){
			next();
		} else {
			res.redirect('/');
		}
	}

	router.get('/chatrooms', securePages, (req,res,next)=>{
		res.render('chatrooms', {'title': "Chitty Chitty Chatcat.", user: req.user, config:config});
	});

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
};
